import prisma from "../config/prismaClient.js";

const getMoodScore = (moodString) => {
    const mapping = { 'Rất vui': 5, 'Vui': 4, 'Bình thường': 3, 'Buồn': 2, 'Rất buồn': 1 };
    return mapping[moodString] || 3;
};

const calculateAverage = (records) => {
    if (!records || records.length === 0) return 0;
    const total = records.reduce((sum, record) => sum + (record.mood_score || getMoodScore(record.mood)), 0);
    return parseFloat((total / records.length).toFixed(1));
};

const formatTime = (dateObj) => {
    const h = dateObj.getHours().toString().padStart(2, '0');
    const m = dateObj.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
};

const getTestHistory = async (userId) => {
    try {
        const assessments = await prisma.assessment.findMany({
            where: { userId: userId },
            include: { 
                testType: true 
            },
            orderBy: { createdAt: 'desc' }
        });
        const historyMap = {};
        assessments.forEach(record => {
            const testCode = record.testTypeCode; 
            
            if (!historyMap[testCode]) {
                historyMap[testCode] = {
                    testId: record.testType.id, 
                    testCode: testCode,        
                    testName: record.testType.description || testCode, 
                    lastDate: record.createdAt,
                    lastScore: record.finalScore, 
                    totalCount: 0
                };
            }
            
            historyMap[testCode].totalCount++;
        });
        return Object.values(historyMap);
    } catch (error) {
        console.error("Lỗi lấy lịch sử test:", error);
        return [];
    }
};
const getStatistics = async (currentUser, type, dateParam, targetUserId) => {
    let userIdToQuery = currentUser.id;
    if (currentUser.role === 'ADMIN' && targetUserId) {
        userIdToQuery = parseInt(targetUserId);
    }
    let startDate = new Date();
    let endDate = new Date(); 
    const queryDate = dateParam ? new Date(dateParam) : new Date();
    let labels = [];
    if (type === 'day') {
        startDate = new Date(queryDate); startDate.setHours(0, 0, 0, 0);
        endDate = new Date(queryDate); endDate.setHours(23, 59, 59, 999);
    } else if (type === 'month') {
        startDate = new Date(queryDate.getFullYear(), queryDate.getMonth(), 1);
        endDate = new Date(queryDate.getFullYear(), queryDate.getMonth() + 1, 0); endDate.setHours(23, 59, 59, 999);
        const daysInMonth = endDate.getDate(); 
        for (let i = 1; i <= daysInMonth; i++) labels.push(`${i}/${queryDate.getMonth() + 1}`);
    } 
    const records = await prisma.emotionDiary.findMany({
        where: {
            userId: userIdToQuery,
            createdAt: { gte: startDate, lte: endDate }
        },
        orderBy: { createdAt: 'asc' }
    });
    let chartData = [];
    if (type === 'day') {
        if (records.length > 0) {
            records.forEach(r => {
                labels.push(formatTime(new Date(r.createdAt)));
                chartData.push(r.mood_score || getMoodScore(r.mood));
            });
        }
    } else if (type === 'month') {
        const daysInMonth = endDate.getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            const subRecords = records.filter(r => new Date(r.createdAt).getDate() === i);
            chartData.push(calculateAverage(subRecords));
        }
    }
    const testHistoryData = await getTestHistory(userIdToQuery);
    return {
        chart: { 
            labels, 
            data: chartData 
        },
        testHistory: testHistoryData, 
        summary: {
            total: records.length,
            average: calculateAverage(records),
            period: { start: startDate, end: endDate },
            viewingUserId: userIdToQuery 
        }
    };
};

export default {
    getStatistics
};