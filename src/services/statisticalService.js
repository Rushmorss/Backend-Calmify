import prisma from "../config/prismaClient.js";

const getMoodScore = (moodString) => {
    const mapping = {
        'Rất vui': 5,
        'Vui': 4,
        'Bình thường': 3,
        'Buồn': 2,
        'Rất buồn': 1
    };
    return mapping[moodString] || 3;
};

const calculateAverage = (records) => {
    if (!records || records.length === 0) return 0;
    const total = records.reduce((sum, record) => sum + getMoodScore(record.mood), 0);
    return parseFloat((total / records.length).toFixed(1));
};

const calculateDistribution = (records) => {
    const counts = { 'Rất vui': 0, 'Vui': 0, 'Bình thường': 0, 'Buồn': 0, 'Rất buồn': 0 };
    let total = 0;
    records.forEach(r => {
        if (counts[r.mood] !== undefined) {
            counts[r.mood]++;
            total++;
        }
    });
    return Object.keys(counts).map(key => ({
        label: key,
        count: counts[key],
        percent: total > 0 ? Math.round((counts[key] / total) * 100) : 0
    }));
};

const formatTime = (dateObj) => {
    const h = dateObj.getHours().toString().padStart(2, '0');
    const m = dateObj.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
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
    let chartData = [];

    if (type === 'day') {
        startDate = new Date(queryDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(queryDate);
        endDate.setHours(23, 59, 59, 999);
    } else if (type === 'week') {
        const day = queryDate.getDay();
        const diff = queryDate.getDate() - day + (day === 0 ? -6 : 1);
        startDate = new Date(queryDate);
        startDate.setDate(diff);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        labels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

    } else if (type === 'month') {
        startDate = new Date(queryDate.getFullYear(), queryDate.getMonth(), 1);
        endDate = new Date(queryDate.getFullYear(), queryDate.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        const daysInMonth = endDate.getDate(); 
        for (let i = 1; i <= daysInMonth; i++) {
            labels.push(`${i}/${queryDate.getMonth() + 1}`);
        }

    } else if (type === 'quarter') {
        const currentMonth = queryDate.getMonth();
        const quarterIndex = Math.floor(currentMonth / 3);
        const startMonth = quarterIndex * 3;
        startDate = new Date(queryDate.getFullYear(), startMonth, 1);
        endDate = new Date(queryDate.getFullYear(), startMonth + 3, 0, 23, 59, 59);
        labels = [`Tháng ${startMonth + 1}`, `Tháng ${startMonth + 2}`, `Tháng ${startMonth + 3}`];

    } else if (type === 'year') {
        startDate = new Date(queryDate.getFullYear(), 0, 1);
        endDate = new Date(queryDate.getFullYear(), 11, 31, 23, 59, 59);
        labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    }

    const records = await prisma.emotionDiary.findMany({
        where: {
            userId: userIdToQuery, 
            createdAt: { gte: startDate, lte: endDate }
        },
        orderBy: { createdAt: 'asc' }
    });

    if (type === 'day') {
        if (records.length > 0) {
            records.forEach(record => {
                labels.push(formatTime(new Date(record.createdAt)));
                chartData.push(getMoodScore(record.mood));
            });
        } else {
            labels = []; 
            chartData = [];
        }

    } else if (type === 'week') {
        for (let i = 0; i < 7; i++) {
            const currentDayDate = new Date(startDate);
            currentDayDate.setDate(startDate.getDate() + i);
            const subRecords = records.filter(r => {
                const rDate = new Date(r.createdAt);
                return rDate.getDate() === currentDayDate.getDate() &&
                    rDate.getMonth() === currentDayDate.getMonth();
            });
            chartData.push(calculateAverage(subRecords));
        }

    } else if (type === 'month') {
        const daysInMonth = endDate.getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            const subRecords = records.filter(r => new Date(r.createdAt).getDate() === i);
            chartData.push(calculateAverage(subRecords));
        }

    } else if (type === 'quarter') {
        const startMonth = startDate.getMonth();
        for (let i = 0; i < 3; i++) {
            const targetMonth = startMonth + i;
            const subRecords = records.filter(r => new Date(r.createdAt).getMonth() === targetMonth);
            chartData.push(calculateAverage(subRecords));
        }

    } else if (type === 'year') {
        for (let i = 0; i < 12; i++) {
            const subRecords = records.filter(r => new Date(r.createdAt).getMonth() === i);
            chartData.push(calculateAverage(subRecords));
        }
    }

    return {
        chart: {
            labels,
            data: chartData
        },
        distribution: calculateDistribution(records),
        summary: {
            total: records.length,
            average: calculateAverage(records),
            period: {
                start: startDate,
                end: endDate
            },
            viewingUserId: userIdToQuery 
        }
    };
};

export default {
    getStatistics
};