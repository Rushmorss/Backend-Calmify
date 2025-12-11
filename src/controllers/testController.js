import { PrismaClient } from '@prisma/client';
import * as testService from '../services/testService.js'; 

const prisma = new PrismaClient();

export const getTestContent = async (req, res) => {
    try {
        const { code } = req.params; 
        const test = await prisma.testType.findUnique({
            where: { code: code },
            include: {
                questions: { 
                    orderBy: { order: 'asc' },
                    select: { id: true, content: true, order: true } 
                },
                scales: { 
                    orderBy: { value: 'asc' },
                    select: { value: true, label: true }
                }
            }
        });

        if (!test) {
            return res.status(404).json({ message: 'Không tìm thấy bài test này' });
        }

        return res.json({
            message: 'Lấy dữ liệu thành công',
            data: test
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};
export const submitTest = async (req, res) => {
    try {
        const { testCode, answers } = req.body;
        const userId = req.user ? req.user.id : 1; 
        if (!testCode || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Dữ liệu gửi lên không hợp lệ' });
        }
        const result = await testService.saveTestResult(userId, testCode, answers);
        return res.status(201).json({
            message: 'Đã lưu kết quả thành công',
            data: result
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: 'Lỗi xử lý', error: err.message });
    }
};