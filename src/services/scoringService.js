export const calculatePHQ9 = (answers) => {
  const totalScore = answers.reduce((sum, item) => sum + (parseInt(item.value) || 0), 0);
  let severity = 'Không/Tối thiểu';
  if (totalScore >= 5) severity = 'Nhẹ';
  if (totalScore >= 10) severity = 'Trung bình';
  if (totalScore >= 15) severity = 'Trung bình nặng';
  if (totalScore >= 20) severity = 'Nặng';
  return {
    totalScore,
    severity,
    resultDetail: { note: "Điểm số dựa trên thang đo PHQ-9 chuẩn." }
  };
};

export const calculateDASS21 = (answers) => {
    const sMap = [1, 6, 8, 11, 12, 14, 18];
    const aMap = [2, 4, 7, 9, 15, 19, 20];
    const dMap = [3, 5, 10, 13, 16, 17, 21];
    let rawS = 0, rawA = 0, rawD = 0;
    answers.forEach(ans => {
        const qId = parseInt(ans.questionOrder || ans.questionId); 
        const val = ans.value || 0;
        if (sMap.includes(qId)) rawS += val;
        if (aMap.includes(qId)) rawA += val;
        if (dMap.includes(qId)) rawD += val;
    });
    const scoreS = rawS * 2;
    const scoreA = rawA * 2;
    const scoreD = rawD * 2;
    const getLevel = (score, ranges) => {
        if (score <= ranges[0]) return 'Bình thường';
        if (score <= ranges[1]) return 'Nhẹ';
        if (score <= ranges[2]) return 'Vừa';
        if (score <= ranges[3]) return 'Nặng';
        return 'Rất nặng';
    };
    const severityS = getLevel(scoreS, [14, 18, 25, 33]);
    const severityA = getLevel(scoreA, [7, 9, 14, 19]);
    const severityD = getLevel(scoreD, [9, 13, 20, 27]);
    return {
        totalScore: scoreS + scoreA + scoreD,
        severity: `D: ${severityD}, A: ${severityA}, S: ${severityS}`,
        resultDetail: {
            stress: { score: scoreS, level: severityS },
            anxiety: { score: scoreA, level: severityA },
            depression: { score: scoreD, level: severityD }
        }
    };
};

export const calculateRADS = (answers) => {
    const totalScore = answers.reduce((sum, item) => sum + (item.value || 0), 0);
    return {
        totalScore,
        severity: totalScore > 30 ? 'Cần chú ý' : 'Bình thường',
        resultDetail: { note: "Thang đo RADS." }
    };

};

export const calculateScore = (testCode, answers) => {
    switch (testCode) {
        case 'PHQ9': return calculatePHQ9(answers);
        case 'DASS21': return calculateDASS21(answers); 
        case 'RADS': return calculateRADS(answers);     
        default: return { totalScore: 0, severity: 'Unknown', resultDetail: {} };
    }
};