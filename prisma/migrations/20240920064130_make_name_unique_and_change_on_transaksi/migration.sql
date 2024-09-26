/*
  Warnings:

  - You are about to drop the column `id_meja` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the column `id_user` on the `transaksi` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mejaId` to the `Transaksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaksi` DROP COLUMN `id_meja`,
    DROP COLUMN `id_user`,
    ADD COLUMN `mejaId` INTEGER NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('MANAGER', 'ADMIN', 'KASIR', 'USER') NOT NULL DEFAULT 'ADMIN';

-- CreateIndex
CREATE UNIQUE INDEX `User_name_key` ON `User`(`name`);

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_mejaId_fkey` FOREIGN KEY (`mejaId`) REFERENCES `Meja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
