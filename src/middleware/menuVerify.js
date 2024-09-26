import Joi from "joi";

const postSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  jenis: Joi.string().valid("MAKANAN", "MINUMAN").insensitive().required(),
  description: Joi.string().required(), 
});

const updateSchema = Joi.object({
  name: Joi.string(),
  price: Joi.number(),
  jenis: Joi.string(),
  description: Joi.string(),
});

export const menuCreate = (req, res, next) => {
  const { error } = postSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: false,
      message: error.details[0].message,
    });
  }
  next();
};

export const menuUpdate = (req, res, next) => {
  const { error } = updateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: false,
      message: error.details[0].message,
    });
  }
  next();
};
