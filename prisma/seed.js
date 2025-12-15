import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('⏳ Đang nạp dữ liệu bài test...')

  // --- 1. PHQ-9 ---
  await prisma.testType.upsert({
    where: { code: 'PHQ9' },
    update: {},
    create: {
      code: 'PHQ9',
      description: 'Trong 2 tuần qua, bạn có thường xuyên bị quấy rầy bởi các vấn đề sau?',
      testScales: {
        create: [
          { value: 0, label: 'Hầu như không' },
          { value: 1, label: 'Một vài ngày' },
          { value: 2, label: 'Hơn một nửa số thời gian' },
          { value: 3, label: 'Gần như mỗi ngày' }
        ]
      },
      questions: {
        create: [
          { questionOrder: 1, content: 'Ít hứng thú hoặc không tìm thấy niềm vui trong công việc' },
          { questionOrder: 2, content: 'Cảm thấy chán nản, buồn rầu hoặc tuyệt vọng' },
          { questionOrder: 3, content: 'Khó ngủ, hoặc ngủ không ngon giấc, hoặc ngủ quá nhiều' },
          { questionOrder: 4, content: 'Cảm thấy mệt mỏi hoặc có ít năng lượng' },
          { questionOrder: 5, content: 'Kém ăn hoặc ăn quá nhiều' },
          { questionOrder: 6, content: 'Cảm thấy tồi tệ về bản thân - hoặc cảm thấy mình thất bại' },
          { questionOrder: 7, content: 'Gặp khó khăn khi tập trung vào công việc, chẳng hạn như đọc báo hoặc xem TV' },
          { questionOrder: 8, content: 'Di chuyển hoặc nói năng quá chậm chạp khiến người khác chú ý' },
          { questionOrder: 9, content: 'Có ý nghĩ rằng chết đi thì tốt hơn hoặc làm tổn thương bản thân' }
        ]
      }
    }
  })

  // --- 2. DASS-21 ---
  await prisma.testType.upsert({
    where: { code: 'DASS21' },
    update: {},
    create: {
      code: 'DASS21',
      description: 'Hãy đọc mỗi câu và chọn mức độ đúng với tình trạng của bạn trong tuần qua.',
      testScales: {
        create: [
          { value: 0, label: 'Không đúng với tôi chút nào cả' },
          { value: 1, label: 'Đúng với tôi phần nào, hoặc thỉnh thoảng mới đúng' },
          { value: 2, label: 'Đúng với tôi phần nhiều, hoặc phần lớn thời gian là đúng' },
          { value: 3, label: 'Hoàn toàn đúng với tôi, hoặc hầu hết thời gian là đúng' }
        ]
      },
      questions: {
        create: [
          { questionOrder: 1, category: 'stress', content: 'Tôi thấy khó mà thoải mái được' },
          { questionOrder: 2, category: 'anxiety', content: 'Tôi bị khô miệng' },
          { questionOrder: 3, category: 'depression', content: 'Tôi không thấy có chút cảm xúc tích cực nào' },
          { questionOrder: 4, category: 'anxiety', content: 'Tôi bị rối loạn nhịp thở (thở gấp, khó thở dù không gắng sức)' },
          { questionOrder: 5, category: 'depression', content: 'Tôi thấy khó bắt tay vào công việc' },
          { questionOrder: 6, category: 'stress', content: 'Tôi hay phản ứng thái quá khi có sự việc xảy ra' },
          { questionOrder: 7, category: 'anxiety', content: 'Tôi bị run (tay, chân...)' },
          { questionOrder: 8, category: 'stress', content: 'Tôi thấy mình đang tiêu tốn nhiều năng lượng do lo âu' },
          { questionOrder: 9, category: 'anxiety', content: 'Tôi lo sợ về những tình huống có thể làm tôi hoảng sợ' },
          { questionOrder: 10, category: 'depression', content: 'Tôi thấy chẳng có gì để mong đợi cả' },
          { questionOrder: 11, category: 'stress', content: 'Tôi thấy bản thân dễ bị kích động' },
          { questionOrder: 12, category: 'stress', content: 'Tôi thấy khó thư giãn được' },
          { questionOrder: 13, category: 'depression', content: 'Tôi cảm thấy chán nản và buồn rầu' },
          { questionOrder: 14, category: 'stress', content: 'Tôi không chấp nhận được việc có cái gì đó xen vào việc tôi đang làm' },
          { questionOrder: 15, category: 'anxiety', content: 'Tôi thấy mình sắp hoảng loạn' },
          { questionOrder: 16, category: 'depression', content: 'Tôi không thấy hăng hái với bất kỳ việc gì' },
          { questionOrder: 17, category: 'depression', content: 'Tôi cảm thấy mình không đáng làm người' },
          { questionOrder: 18, category: 'stress', content: 'Tôi thấy mình khá dễ phật ý/tự ái' },
          { questionOrder: 19, category: 'anxiety', content: 'Tôi nghe thấy nhịp tim mình (dù không hoạt động thể lực)' },
          { questionOrder: 20, category: 'anxiety', content: 'Tôi hay sợ vô cớ' },
          { questionOrder: 21, category: 'depression', content: 'Tôi thấy cuộc sống vô nghĩa' }
        ]
      }
    }
  })
  
  console.log('✅ Nạp dữ liệu hoàn tất!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
// prisma/seed.js
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// async function main() {
//   console.log('🌱 Đang tạo dữ liệu mẫu...');

//   // Xóa dữ liệu cũ để tránh trùng lặp (tùy chọn)
//   await prisma.exercise.deleteMany();
//   await prisma.category.deleteMany();

//   // 1. Tạo Category: THIỀN
//   const thien = await prisma.category.create({
//     data: {
//       title: 'Thiền Chánh Niệm',
//       description: 'Tìm lại sự bình yên nội tâm qua từng hơi thở.',
//       thumbnail: 'https://img.freepik.com/free-photo/woman-meditating-nature_1098-1426.jpg',
//       exercises: {
//         create: [
//           {
//             title: 'Thiền 5 phút buổi sáng',
//             description: 'Khởi động ngày mới đầy năng lượng.',
//             instruction: '1. Ngồi thẳng lưng.\n2. Nhắm mắt nhẹ.\n3. Hít thở sâu.',
//             videoUrl: 'https://www.youtube.com/embed/inpok4MKVLM',
//             thumbnail: 'https://i.ytimg.com/vi/inpok4MKVLM/maxresdefault.jpg'
//           },
//           {
//             title: 'Thiền buông thư',
//             description: 'Giúp thư giãn toàn thân trước khi ngủ.',
//             instruction: 'Nằm ngửa thoải mái, thả lỏng từng phần cơ thể.',
//             videoUrl: 'https://www.youtube.com/embed/2OEL4P1Rz04',
//             thumbnail: 'https://img.freepik.com/free-photo/sleep-relax_1098-1234.jpg'
//           }
//         ]
//       }
//     }
//   });

//   // 2. Tạo Category: YOGA
//   await prisma.category.create({
//     data: {
//       title: 'Yoga Trị Liệu',
//       description: 'Cải thiện sức khỏe thể chất và tinh thần.',
//       thumbnail: 'https://img.freepik.com/free-vector/yoga-position_23-2148154946.jpg',
//       exercises: {
//         create: [
//           {
//             title: 'Yoga giảm đau lưng',
//             description: 'Bài tập cho dân văn phòng.',
//             instruction: 'Thực hiện nhẹ nhàng, không cố quá sức.',
//             videoUrl: 'https://www.youtube.com/embed/LiUnFJ8PdbQ',
//             thumbnail: 'https://i.ytimg.com/vi/LiUnFJ8PdbQ/maxresdefault.jpg'
//           }
//         ]
//       }
//     }
//   });

//   console.log('✅ Đã tạo xong dữ liệu mẫu!');
// }

// main()
//   .catch(e => console.error(e))
//   .finally(async () => await prisma.$disconnect());