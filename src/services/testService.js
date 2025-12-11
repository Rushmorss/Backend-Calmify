import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const saveTestResult = async (userId, testCode, userAnswers) => {
    const questions = await prisma.question.findMany({
        where: { testCode: testCode },
        orderBy: { order: 'asc' }
    });
    if (questions.length !== userAnswers.length) {
        throw new Error(`Số câu trả lời (${userAnswers.length}) không khớp với số câu hỏi (${questions.length})`);
    }
    let totalScore = 0;
    let resultDetail = {};
    let severity = '';
    if (testCode === 'PHQ9') {
        totalScore = userAnswers.reduce((a, b) => a + b, 0);
        if (totalScore >= 20) severity = 'Trầm cảm nặng (Severe)';
        else if (totalScore >= 15) severity = 'Trầm cảm khá nặng (Moderately severe)';
        else if (totalScore >= 10) severity = 'Trầm cảm vừa (Moderate)';
        else if (totalScore >= 5) severity = 'Trầm cảm nhẹ (Mild)';
        else severity = 'Không có dấu hiệu (None-minimal)';
    }
    else if (testCode === 'DASS21') {
        let scores = { stress: 0, anxiety: 0, depression: 0 };
        questions.forEach((q, index) => {
            const val = userAnswers[index];
            if (q.category && scores[q.category] !== undefined) {
                scores[q.category] += val;
            }
        });
        scores.stress *= 2;
        scores.anxiety *= 2;
        scores.depression *= 2;
        resultDetail = scores;
        totalScore = Math.max(scores.stress, scores.anxiety, scores.depression);
        if (totalScore >= 28) severity = 'Cực kỳ nghiêm trọng'; 
        else severity = 'Đã ghi nhận kết quả';
    }
    const savedRecord = await prisma.assessment.create({
        data: {
            userId,
            testType: testCode,
            answers: userAnswers, 
            totalScore,
            resultDetail,
            severity
        }
    });
    return savedRecord;
};