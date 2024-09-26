/*
  Warnings:

  - The values [Makanan,Minuman] on the enum `Menu_jenis` will be removed. If these variants are still used in the database, this will fail.
  - The values [Belum_bayar,Lunas] on the enum `Transaksi_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `menu` MODIFY `jenis` ENUM('MAKANAN', 'MINUMAN') NOT NULL;

-- AlterTable
ALTER TABLE `transaksi` MODIFY `status` ENUM('BELUM_BAYAR', 'LUNAS') NOT NULL;
