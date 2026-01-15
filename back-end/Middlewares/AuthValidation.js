const Joi = require('joi');

const signupValidation = (req, res, next) => {
  
  // console.log("REQ BODY:", req.body);

  const schema = Joi.object({
    role: Joi.string().valid('customer', 'farmer', 'admin').required(),
    email: Joi.string().email().min(3).max(100).required(),
    password: Joi.string().min(8).max(100).required()
  });
  const { error } = schema.validate(req.body);
  console.log("Validation error:", error);
  if (error) {
    
    return res.status(400)
    .json({message: "Bad Request",  error})
  }
  next();
};

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().min(3).max(100).required(),
    password: Joi.string().min(8).max(100).required()
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400)
    .json({message: "Bad Request",  error})
  }
  next();
};
module.exports = { signupValidation  ,
     loginValidation };