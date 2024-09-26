/*
  Warnings:

  - You are about to drop the column `deskripsi` on the `menu` table. All the data in the column will be lost.
  - You are about to drop the column `gambar` on the `menu` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `menu` DROP COLUMN `deskripsi`,
    DROP COLUMN `gambar`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `image` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('MANAGER', 'ADMIN', 'KASIR') NOT NULL DEFAULT 'ADMIN';

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);
