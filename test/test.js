const { type } = require("@testing-library/user-event/dist/type");

// TEST
const testTable = [
  {
    id: "test-01",
    name: "Test Table",
    description: "This is a test table for demonstration purposes.",
    questions: [
      {
        id: 1,
        question: "Ít quan tâm hoặc thích làm việc",
        answers: "answerOptionTable" = "PHQ-9", // 
      },
      {
        id: 2,
        question: "How many pets do you have?",
        answers: "answerOptionTable" = "PHQ-9",
      },
      {
        id: 3,
        question: "Select your preferred programming languages.",
        answers: "answerOptionTable" = "PHQ-9",
      },
    ],
  },
  {
    id: "test-02",
    name: "Test Table 2",
    description: "This is another test table for demonstration purposes.",
    questions: [
      {
        id: 1,
        question: "Cảm thấy căng thẳng hoặc lo lắng",
        answers: "answerOptionTable" = "DASS-21",
      },
      {
        id: 2,
        question: "How often do you exercise?",
        answers: "answerOptionTable" = "DASS-21",
      },
      {
        id: 3,
        question: "Select your favorite colors.",
        answers: "answerOptionTable" = "DASS-21",
      },
    ],
  }
];

// ANSWER_OPTION 
const answerOptionTable = [
  {
    id: 1,
    testId: "test-01",
    answers: [
      { text: "Không có gì", points: 0 },
      { text: "Vài ngày", points: 1 },
      { text: "Hơn nửa ngày", points: 2 },
      { text: "Gần hàng ngày", points: 3 },
    ],
  },
  {
    id: 2,
    testId: "test-02",
    answers: [
      { text: "Thất vọng", points: 0 },
      { text: "Buồn", points: 1 },
      { text: "Vui", points: 2 },
      { text: "Vui vãi lều", points: 3 },
    ],
  },
];
const assessmentTable = {
  id: "AS_01",
  userId: "USER_123",
  date: "2024-06-15",
  totalPoints: 8,
  responses: [
    {
      questionId: 1,
      selectedAnswer: "Không có gì",
      pointsEarned: 0,
    },
    {
      questionId: 2,
      selectedAnswer: "Vài ngày",
      pointsEarned: 2,
    },
    {
      questionId: 3,
      selectedAnswer: "Gần hàng ngày",
      pointsEarned: 4,
    },
  ],
};