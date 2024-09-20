import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createMenu = async (req, res) => {
    try {
        const {name , price, jenis, deskripsi, gambar} = req.body;

        const menu = await prisma.menu.create({
            data: { 
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Error on : [Menu_POST]`,
            data: error
        })
    }
}