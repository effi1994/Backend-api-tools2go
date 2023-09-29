const Joi = require("joi");

module.exports = schema => (req, res, next) => {
  console.log(req.body);
  const result = Joi.validate(req.body, schema);
  console.log(result);

  if (result.error)
    return res.status(400).send({ error: result.error.details[0].message });

  next();
};
