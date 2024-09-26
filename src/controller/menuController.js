import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";

const prisma = new PrismaClient();

export const postMenu = async (req, res) => {
    try {
        const {name , price, jenis, description} = req.body;

        let filename = "";
        if (req.file) filename = req.file.filename;

        const menu = await prisma.menu.create({
            data: { 
                name: name,
                price: price,
                jenis: jenis.toUpperCase(),
                description: description,
                image: filename,
            }
        })

        return res.status(200).json({
            status: true,
            message: `Success create an menu`,
            data: menu
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: `Error on : [Menu_POST]`,
            data: error
        })
    }
}

export const getMenu = async (req, res) => {
    try {
        const menu = await prisma.menu.findMany({
            orderBy: {
                id: 'asc'
            }
        })

        if(!menu) {
            return res.status(404).json({
                status: false,
                message: `Menu not found`,
            })
        }else {
            return res.status(200).json({
                status: true,
                message: `Success get menu`,
                data: menu
            })
        }

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Error on : [Menu_GET]`,
            data: error.message
        })
    }
}

export const deleteMenu = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const findId = await prisma.menu.findUnique({
            where: {
                id: id
            }
        })

        if(!findId) {
            return res.status(404).json({
                status: false,
                message: `ID Not found`,
            })
        }

        if(findId.image){
            const path = `./saves/${findId.image}`;
            try {
                await fs.unlink(path);
            } catch (error) {
                return res.json({
                    status: false,
                    message: `Error on : [Menu_DELETE]`,
                    data: error.message
                })
            }
        }

        const menu = await prisma.menu.delete({
            where: {
                id: id,
            },
        })

        return res.status(200).json({
            status: true,
            message: `Success delete menu`,
            data: menu
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Error on : [Menu_DELETE]`,
            data: error
        })
    }
}

export const updateMenu = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const {name , price, jenis, description,} = req.body;

        const findId = await prisma.menu.findUnique({
            where: {
                id: id,
            }
        })

        if(!findId) {
            return res.status(404).json({
                status: false,
                message: `ID Not found`,
            })
        }

        let filename = "";
        if (req.file) {
            filename = req.file.filename;

            if(findId.image){
                const path = `./saves/${findId.image}`;
                try {
                    await fs.unlink(path);
                } catch (error) {
                    return res.json({
                        status: false,
                        message: `Error on : [Menu_UPDATE]`,
                        data: error.message
                    })
                }
            }
        }

        const menu = await prisma.menu.update({
            where: {
                id: id
            },
            data: {
                name: name || findId.name,
                price: price || findId.price,
                jenis: jenis || findId.jenis,
                description: description || findId.description,
                image: filename || findId.image
            }
        })

        return res.status(200).json({
            status: true,
            message: `Success update menu`,
            data: menu
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Error on : [Menu_UPDATE]`,
            data: error.message
        })
    }
}