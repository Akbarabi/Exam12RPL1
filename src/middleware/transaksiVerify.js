import Joi from "joi";

const postSchema = Joi.object({
  tanggal: Joi.string().required(),
  userId: Joi.number().required(),
  mejaId: Joi.number().required(),
  nama_pelanggan: Joi.string().required(),
  status: Joi.string()
    .valid("LUNAS", "BELUM_BAYAR")
    .insensitive()
    .required(),
    detail_transaksi: Joi.array().required(),
});

const updateSchema = Joi.object({
  tanggal: Joi.date(),
  userId: Joi.number(),
  mejaId: Joi.number(),
  nama_pelanggan: Joi.string(),
  status: Joi.string()
    .valid("LUNAS", "BELUM BAYAR")
    .insensitive()
    .optional()
    .messages({
      "any.only": "Status not valid",
    }),
});

export const transaksiCreate = (req, res, next) => {
  try {
    const { error } = postSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error on : [TRANSAKSI_VERIFY]`,
      data: error.message,
    });
  }
};

export const transaksiUpdate = (req, res, next) => {
  try {
    const { error } = updateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error on : [TRANSAKSI_VERIFY]`,
      data: error.message,
    });
  }
};
