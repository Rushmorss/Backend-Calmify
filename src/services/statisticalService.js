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

const getStatistics = async (userId, type, dateParam) => {
    let startDate = new Date();
    let endDate = new Date();
    const queryDate = dateParam ? new Date(dateParam) : new Date();
    let labels = [];
    let chartData = [];
    if (type === 'day') {
        startDate = new Date(queryDate.setHours(0, 0, 0, 0));
        endDate = new Date(queryDate.setHours(23, 59, 59, 999));
        labels = ['Sáng', 'Chiều', 'Tối', 'Đêm'];
    } else if (type === 'month') {
        startDate = new Date(queryDate.getFullYear(), queryDate.getMonth(), 1);
        endDate = new Date(queryDate.getFullYear(), queryDate.getMonth() + 1, 0, 23, 59, 59);
    } else if (type === 'year') {
        startDate = new Date(queryDate.getFullYear(), 0, 1);
        endDate = new Date(queryDate.getFullYear(), 11, 31, 23, 59, 59);
    }

    const records = await prisma.emotionDiary.findMany({
        where: {
            userId: userId,
            createdAt: { gte: startDate, lte: endDate }
        },
        orderBy: { createdAt: 'asc' }
    });

    if (type === 'day') {
        const periods = [[6, 12], [12, 18], [18, 24], [0, 6]]; 
        chartData = periods.map(([start, end]) => {
            const subRecords = records.filter(r => {
                const h = new Date(r.createdAt).getHours();
                return h >= start && h < end;
            });
            return calculateAverage(subRecords);
        });
    } else if (type === 'month') {
        labels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4']; 
        const daysInMonth = endDate.getDate();
        const quarter = Math.ceil(daysInMonth / 4);
        
        for (let i = 0; i < 4; i++) {
            const startDay = i * quarter + 1;
            const endDay = (i + 1) * quarter;
            const subRecords = records.filter(r => {
                const d = new Date(r.createdAt).getDate();
                return d >= startDay && d <= endDay;
            });
            chartData.push(calculateAverage(subRecords));
        }
    } else if (type === 'year') {
        labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        for (let i = 0; i < 12; i++) {
            const subRecords = records.filter(r => new Date(r.createdAt).getMonth() === i);
            chartData.push(calculateAverage(subRecords));
        }
    }

    return {
        chart: { labels, data: chartData },
        distribution: calculateDistribution(records),
        summary: {
            total: records.length,
            average: calculateAverage(records)
        }
    };
};
export default {
    getStatistics
};