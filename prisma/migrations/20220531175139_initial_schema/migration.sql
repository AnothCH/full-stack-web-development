-- CreateTable
CREATE TABLE `questionnaire` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` VARCHAR(191) NOT NULL,
    `ans1` VARCHAR(191) NOT NULL,
    `ans2` VARCHAR(191) NOT NULL,
    `ans3` VARCHAR(191) NULL,
    `ans4` VARCHAR(191) NULL,
    `ans5` VARCHAR(191) NULL,
    `ans6` VARCHAR(191) NULL,
    `correct_answer` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
