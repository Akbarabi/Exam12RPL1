import Joi from "joi";

const postSchema = Joi.object({
  jumlah: Joi.number().required(),
  transaksiId: Joi.number().required(),
  menuId: Joi.number().required(),
});

const updateSchema = Joi.object({
  jumlah: Joi.number(),
  transaksiId: Joi.number(),
  menuId: Joi.number(),
});

export const postDetail = (req, res, next) => {
  try {
    const { error } = postSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error on : [DETAIL_VERIFY]`,
      data: error.message,
    });
  }
};

export const updateDetail = (req, res, next) => {
  try {
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error on : [DETAIL_VERIFY]`,
      data: error.message,
    });
  }
};
