import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import fs from "fs-extra";
import PDFDocument from "pdfkit";

const prisma = new PrismaClient();

export const createTransaksi = async (req, res) => {
  try {
    const { userId, mejaId, nama_pelanggan, status, detail_transaksi } =
      req.body;

    const transaksiData = {
      tanggal: new Date().toISOString(),
      userId,
      mejaId,
      nama_pelanggan,
      status: status.toUpperCase() || "BELUM_BAYAR",
      detail_transaksi: await Promise.all(
        detail_transaksi.map(async (detail) => {
          const menu = await prisma.menu.findUnique({
            where: {
              id: detail.menuId,
            },
          });

          if (!menu) {
            throw new Error(`Menu with ID ${detail.menuId} not found`);
          }

          return {
            jumlah: detail.jumlah,
            harga: menu.price * detail.jumlah,
            menuId: detail.menuId,
          };
        })
      ),
    };

    const transaksi = await prisma.transaksi.create({
      data: transaksiData,
      include: {
        detail_transaksi: {
          include: {
            id_transaksi: true,
            menu: true,
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
    res.status(500).json({ error: error.message });
  }
};

export const getTransaction = async (req, res) => {
  try {
    const keyword = req.params.keyword;

    const transaksi = await prisma.transaksi.findMany({
      where: {
        tanggal: { equals: keyword || "" },
      },
      orderBy: {
        id: "asc",
      },
    });

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

export const printNota = async (req, res) => {
  try {
    const { transaksiId } = req.params;

    const transaksi = await prisma.transaksi.findUnique({
      where: { id: Number(transaksiId) },
      include: {
        user_details: true, // Nama kasir
        meja_details: true, // Nomor meja
        detail_transaksi: {
          include: {
            id_menu: true, // Include nama dan harga menu
          },
        },
      },
    });

    if (!transaksi) {
      return res.status(404).json({
        status: false,
        message: "Transaksi tidak ditemukan",
      });
    }

    // Hitung total harga transaksi
    const totalHarga = transaksi.detail_transaksi.reduce((total, detail) => {
      return total + Number(detail.harga);
    }, 0);

    // Format tanggal menggunakan dayjs
    const tanggalFormatted = dayjs(transaksi.tanggal).format(
      "DD MMMM YYYY, HH:mm"
    );

    const doc = new PDFDocument();

    const filename = `nota-${transaksiId}.pdf`;
    const filepath = `./saves/nota/${filename}`;

    doc.pipe(fs.createWriteStream(filepath));

    doc.fontSize(20).text("Cafe Kita", { align: "center" }).moveDown();

    doc
      .fontSize(12)
      .text(`Tanggal: ${tanggalFormatted}`)
      .text(`Nama Kasir: ${transaksi.user_details.name}`)
      .text(`Nomor Meja: ${transaksi.meja_details.id}`)
      .text(`Nama Pelanggan: ${transaksi.nama_pelanggan}`)
      .moveDown();

    doc.text("Pesanan:");
    transaksi.detail_transaksi.forEach((detail) => {
      doc.text(
        `- ${detail.id_menu.name} x${detail.jumlah} = Rp ${Number(
          detail.harga
        ).toLocaleString()}`
      );
    });

    doc
      .moveDown()
      .text(`Total Harga: Rp ${totalHarga.toLocaleString()}`, {
        align: "right",
      })
      .moveDown()
      .text(`Status Pembayaran: ${transaksi.status}`, { align: "center" })
      .moveDown()
      .text("Terima kasih telah berkunjung!", { align: "center" });

    // Akhiri dokumen
    doc.end();

    return res.status(201).json({
      status: true,
      message: "Nota berhasil disimpan sebagai PDF",
      filePath: filepath,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error on : [printNota]`,
      data: error.message,
    });
  }
};
