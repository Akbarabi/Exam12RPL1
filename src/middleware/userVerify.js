import Joi from "joi";

const postSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("USER", "ADMIN", "KASIR", "MANAGER").insensitive().messages({
    'any.only': 'Role not valid'
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .required()
    .min(5)
    .regex(/^[a-zA-Z0-9]{3,30}$/).messages({
      'string.pattern.base': 'Password must be alphanumeric',
    }),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(5),
  role: Joi.string().valid("ADMIN", "KASIR", "MANAGER").insensitive().optional().messages({
    'any.only': 'Role not valid'
  }),
});

export const userRegister = (req, res, next) => {
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
      message: `Error on : [USER_VERIFY]`,
      data: error.message,
    });
  }
};

export const userLogin = (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);

    if (error) {
      return res.status.json({
        status: false,
        message: error.message,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error on : [USER_VERIFY]`,
      data: error,
    });
  }
};

export const userUpdate = (req, res, next) => {
  try {
    const { error } = updateSchema.validate(req.body);

    if(error){
      return res.status(400).json({
        status: false,
        message: error.message
      })
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error on : [USER_VERIFY]`,
      data: error,
    })   
  }
}