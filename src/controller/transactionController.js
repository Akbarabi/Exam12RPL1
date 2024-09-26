import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTransaksi = async (req, res) => {
  try {
    const { tanggal, userId, mejaId, nama_pelanggan, status, detail_transaksi } = req.body;

    // Buat transaksi
    const transaksi = await prisma.transaksi.create({
      data: {
        tanggal: new Date().toISOString(), // Menggunakan tanggal yang diberikan dalam format body JSON
        userId,
        mejaId,
        nama_pelanggan,
        status: status.toUpperCase() || "BELUM_BAYAR", // Status otomatis uppercase
        detail_transaksi: {
          create: await Promise.all(
            detail_transaksi.map(async (detail) => {
              // Cari menu berdasarkan menuId
              const menu = await prisma.menu.findUnique({
                where: {
                  id: detail.menuId,
                },
              });

              if (!menu) {
                throw new Error(`Menu with ID ${detail.menuId} not found`);
              }

              // Kembalikan detail transaksi dengan jumlah dan harga
              return {
                jumlah: detail.jumlah,
                harga: menu.price * detail.jumlah, // Menghitung total harga
                menuId: detail.menuId,
              };
            })
          ),
        },
      },
      include: {
        detail_transaksi: {
          include: {
            id_transaksi: true, // Termasuk informasi transaksi
          },
        },
      },
    });

    return res.status(201).json({
      status: true,
      message: "Success creating transaction",
      data: transaksi,
    });
  } catch (error) {
    console.error("Error creating transaksi:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getTransaction = async (req, res) => {
  try {
    const transaksi = await prisma.transaksi.findMany();

    return res.status(200).json({
      status: true,
      message: `Success get transaction`,
      data: transaksi,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error on : [Transaction_GET]`,
      data: error.message,
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        status: false,
        message: `Id not found`,
      });
    }

    const transaksi = await prisma.transaksi.delete({
      where: {
        id: id,
      },
      include: {
        user_details: true,
        meja: true,
        detail_transaksi: true,
      },
    });

    return res.status(200).json({
      status: true,
      message: `Success delete transaction`,
      data: transaksi,
    });
  } catch (error) {
    return res.status(500).jsom({
      status: false,
      message: `Error on : [Transaction_DELETE]`,
      data: error.message,
    });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      tanggal,
      userId,
      mejaId,
      nama_pelanggan,
      status,
      detail_transaksi,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: `Id not found`,
      });
    }

    const transaksi = await prisma.transaksi.update({
      where: {
        id: id,
      },
      data: {
        tanggal: tanggal || transaksi.tanggal,
        userId: userId || transaksi.userId,
        mejaId: mejaId || transaksi.mejaId,
        nama_pelanggan: nama_pelanggan || transaksi.nama_pelanggan,
        status: status || transaksi.status,
        detail_transaksi: {
          deleteMany: {},
          create: detail_transaksi.map((detail) => {
            return {
              jumlah: detail.jumlah,
              harga: detail.harga,
              menu: {
                connect: detail.menuIds.map((menuId) => ({
                  id: menuId,
                })),
              },
            };
          }),
        },
      },
      include: {
        detail_transaksi: {
          include: {
            menus: true,
          },
        },
      },
    });

    return res.status(200).json({
      status: true,
      message: `Success update transaction`,
      data: transaksi,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error on : [Transaction_UPDATE]`,
      data: error.message,
    });
  }
};
