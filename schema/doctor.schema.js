const Joi = require('@hapi/joi');

module.exports = {

  consultPatient: Joi.object({
    doctorId: Joi.string().required(),
    patientId: Joi.string().required(),
    historyType: Joi.string().required(),
    symptoms: Joi.string().required(),
    note: Joi.string(),
    test: Joi.string(),
    report: Joi.string(),
    medicine: Joi.string(),
    advise: Joi.string(),
  }),

};
