const Joi = require('@hapi/joi');

module.exports = {

  createPatient: Joi.object({
    name: Joi.string().trim().min(3).max(30)
      .required()
      .error(() => new Error('"name" is required should at least 3 and maximum 30 characters long.')),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    mobile: Joi.number().required(),
    address: Joi.string(),
    bloodGroup: Joi.string(),
    isDonor: Joi.boolean(),
    designation: Joi.string(),
  }),

  updateAuthor: Joi.object({
    name: Joi.string(),
    mobile: Joi.number(),
    email: Joi.string().email(),
    image: Joi.string(),
  }),

};
