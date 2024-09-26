import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const postMeja = async(req, res) => {
    try {
        // Check if nomor_meja is present and is a valid number
        const nomor_meja = Number(req.body.nomor_meja);
        
        if (!nomor_meja || isNaN(nomor_meja)) {
            return res.status(400).json({
                status: false,
                message: "nomor_meja is required and must be a valid number"
            });
        }

        // Proceed to create meja if validation passes
        const meja = await prisma.meja.create({
            data: {
                nomor_meja: nomor_meja
            }
        });

        return res.status(200).json({
            status: true,
            message: `Success create a meja`,
            data: meja
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Error on : [Meja_POST]`,
            data: error.message
        });
    }
};


export const getMeja = async (req, res) => {
    try {
        const meja = await prisma.meja.findMany();
        return res.status(200).json({
            status: true,
            message: `Success get meja`,
            data: meja
        });
        
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Error on : [Meja_GET]`,
            data: error.message
        })
    }
}

export const deleteMeja = async(req, res) => {
    try {
        const id = Number(req.params.id);
        
        const meja = await prisma.meja.delete({
            where: {
                id: id
            }
        })

        return res.status(200).json({
            status: true,
            message: `Success delete meja`,
            data: meja
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Error on : [Meja_DELETE]`,
            data: error.message
        })
    }
}

export const updateMeja = async(req, res) => {
    try {
        const id = Number(req.params.id);
        const nomor_meja = Number(req.body.nomor_meja);

        const meja = await prisma.meja.update({
            where: {
                id: id
            },
            data: {
                nomor_meja: nomor_meja
            }
        })

        return res.status(200).json({
            status: true,
            message: `Success update meja`,
            data: meja
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Error on : [Meja_UPDATE]`,
            data: error.message
        })
    }
}