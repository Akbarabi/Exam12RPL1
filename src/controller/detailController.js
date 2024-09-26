import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const postDetail = async (req, res) => {
    try {
        const { jumlah, transaksiId, menuId } = req.body;

        const menu = await prisma.menu.findUnique({
            where: {
                id: menuId
            }
        })

        const transaksi = await prisma.transaksi.findUnique({
            where: {
                id: transaksiId
            }
        })

        if (!menu || !transaksi, error) {
            return res.status(404).json({
                status: false,
                message: `MenuId or transaksiId not found`,
                data: error.messag
            })
        }

        const harga = menu.price * jumlah;

        const detail = await prisma.detail_transaksi.create({
            data: {
                jumlah: jumlah,
                harga: harga,
                transaksiId: transaksiId,
                menuId: menuId
            }
        })

        return res.status(200).json({
            status: true,
            message: `Success create detail`,
            data: detail,
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Error on : [Detail_POST]`,
            data: error.message
        })
    }
}

export const getDetail = async (req, res) => {
    try {
        const detail = await prisma.detail_transaksi.findMany();
        return res.status(200).json({
            status: true,
            message: `Success get detail`,
            data: detail
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Error on : [Detail_GET]`,
            data: error.message
        })
    }
}

export const deleteDetail = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if(!id) {
            return res.status(400).json({
                status: false,
                message: `Id not found`
            })
        }

        const detail = await prisma.detail_transaksi.delete({
            where: {
                id: id
            }
        })

        return res.status(200).json({
            status: true,
            message: `Success delete detail`,
            data: detail
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Error on : [Detail_DELETE]`,
            data: error.message
        })
    }
}

export const updateDetail = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if(!id) {
            return res.status(400).json({
                status: false,
                message: `Id not found`
            })
        }

        const { jumlah, transaksiId, menuId } = req.body;

        const menu = await prisma.menu.findUnique({
            where: {
                id: menuId
            }
        })

        if (!menu) {
            return res.status(404).json({
                status: false,
                message: `Menu not found`
            })
        }

        const harga = menu.price * jumlah;

        const detail = await prisma.detail_transaksi.update({
            where: {
                id: id
            },
            data: {
                jumlah: jumlah || detail.harga,
                harga: harga || detail.harga,
                transaksiId: transaksiId || detail.transaksiId,
                menuId: menuId || detail.menuId
            }
        })

        return res.status(200).json({
            status: true,
            message: `Success update detail`,
            data: detail
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Error on : [Detail_UPDATE]`,
            data: error.message
        })
    }
}
