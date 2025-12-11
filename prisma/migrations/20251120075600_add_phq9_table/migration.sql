-- CreateTable
CREATE TABLE `PHQ9_Submissions` (
    `SubmissionID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `SubmissionDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `q1_interest` TINYINT NOT NULL,
    `q2_feeling_down` TINYINT NOT NULL,
    `q3_sleep` TINYINT NOT NULL,
    `q4_tired` TINYINT NOT NULL,
    `q5_appetite` TINYINT NOT NULL,
    `q6_self_esteem` TINYINT NOT NULL,
    `q7_concentration` TINYINT NOT NULL,
    `q8_movement` TINYINT NOT NULL,
    `q9_self_harm` TINYINT NOT NULL,
    `q10_difficulty` TINYINT NOT NULL,
    `TotalScore` TINYINT NOT NULL,

    PRIMARY KEY (`SubmissionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PHQ9_Submissions` ADD CONSTRAINT `PHQ9_Submissions_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
