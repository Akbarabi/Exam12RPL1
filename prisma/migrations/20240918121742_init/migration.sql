-- CreateTable
CREATE TABLE `Test` (
    `testID` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Test_testID_key`(`testID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
