import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu tạo dữ liệu mẫu...');
  await prisma.exercise.deleteMany();
  await prisma.exerciseCategory.deleteMany();
  console.log('Đã xóa dữ liệu cũ.');
  const catThien = await prisma.exerciseCategory.create({
    data: {
      title: 'Thiền chánh niệm',
      description: 'Giảm căng thẳng, cải thiện sự tập trung và mang lại sự bình yên nội tâm thông qua các bài thiền dẫn dắt.',
      thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop',
      exercises: {
        create: [
          {
            title: 'Thiền 5 phút cho người bận rộn',
            description: 'Bài thiền ngắn giúp bạn quay về hơi thở và bình tĩnh lại ngay cả khi đang bận rộn.',
            instruction: 'Tìm nơi yên tĩnh, đeo tai nghe và thả lỏng cơ thể.',
            videoUrl: 'https://www.youtube.com/embed/O-6f5wQXSu8', 
            thumbnail: 'https://img.youtube.com/vi/O-6f5wQXSu8/maxresdefault.jpg',
          },
          {
            title: 'Thiền giảm lo âu và căng thẳng',
            description: 'Bài tập tập trung vào việc buông bỏ những suy nghĩ tiêu cực và lo lắng.',
            instruction: 'Ngồi khoanh chân, thẳng lưng, hít thở sâu theo nhịp dẫn.',
            videoUrl: 'https://www.youtube.com/embed/z6X5oEIg6Ak',
            thumbnail: 'https://img.youtube.com/vi/z6X5oEIg6Ak/maxresdefault.jpg',
          },
          {
            title: 'Thiền dẫn dắt vào giấc ngủ sâu',
            description: 'Nghe bài này trước khi đi ngủ 15 phút để thư giãn toàn thân và dễ ngủ hơn.',
            instruction: 'Nằm ngửa trên giường, buông lỏng tay chân, nhắm mắt lại.',
            videoUrl: 'https://www.youtube.com/embed/aEqlQvczMJQ',
            thumbnail: 'https://img.youtube.com/vi/aEqlQvczMJQ/maxresdefault.jpg',
          },
        ],
      },
    },
  });

  const catTho = await prisma.exerciseCategory.create({
    data: {
      title: 'Bài tập thở',
      description: 'Các kỹ thuật thở giúp điều hòa nhịp tim và lấy lại bình tĩnh tức thì.',
      thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop',
      exercises: {
        create: [
          {
            title: 'Kỹ thuật thở 4-7-8',
            description: 'Phương pháp thở giúp thư giãn hệ thần kinh cực nhanh.',
            instruction: 'Hít vào bằng mũi trong 4s -> Nín thở 7s -> Thở ra bằng miệng 8s.',
            videoUrl: 'https://www.youtube.com/embed/LiUnFJ8PdbQ',
            thumbnail: 'https://img.youtube.com/vi/LiUnFJ8PdbQ/maxresdefault.jpg',
          },
          {
            title: 'Thở bụng (Thở cơ hoành)',
            description: 'Giúp tăng cường dung tích phổi và giảm stress.',
            instruction: 'Đặt tay lên bụng, hít vào sao cho bụng phình lên, ngực giữ nguyên.',
            videoUrl: 'https://www.youtube.com/embed/kgTL5G1ibIo',
            thumbnail: 'https://img.youtube.com/vi/kgTL5G1ibIo/maxresdefault.jpg',
          },
        ],
      },
    },
  });

  const catNhac = await prisma.exerciseCategory.create({
    data: {
      title: 'Âm thanh thư giãn',
      description: 'Nhạc không lời, tiếng mưa, tiếng thiên nhiên giúp tập trung học tập hoặc thư giãn.',
      thumbnail: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1000&auto=format&fit=crop',
      exercises: {
        create: [
          {
            title: 'Tiếng mưa rơi trong rừng',
            description: 'Âm thanh trắng giúp não bộ tập trung làm việc.',
            instruction: 'Đeo tai nghe và điều chỉnh âm lượng vừa phải.',
            videoUrl: 'https://www.youtube.com/embed/q76bMs-NwRk',
            thumbnail: 'https://img.youtube.com/vi/q76bMs-NwRk/maxresdefault.jpg',
          },
        ],
      },
    },
  });

  console.log(`Đã tạo xong: 
  - ${catThien.title}
  - ${catTho.title}
  - ${catNhac.title}`);
}

main()
  .catch((e) => {
    console.error('Có lỗi xảy ra:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });