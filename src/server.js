import "dotenv/config";
import app from "./app.js"; 
import prisma from "./config/prismaClient.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log(`Database connected successfully!`);
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1); 
  }
};

startServer();