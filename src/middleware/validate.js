const ApiError = require('../utils/ApiError');

/**
 * Joi validation middleware.
 * @param {Object} schema - Joi schema object with optional body, params, query keys
 */
const validate = (schema) => {
  return (req, _res, next) => {
    const errors = [];

    for (const source of ['body', 'params', 'query']) {
      if (schema[source]) {
        const { error, value } = schema[source].validate(req[source], {
          abortEarly: false,
          stripUnknown: true,
          errors: { wrap: { label: false } },
        });

        if (error) {
          const details = error.details.map((d) => ({
            field: d.path.join('.'),
            message: d.message,
          }));
          errors.push(...details);
        } else {
          req[source] = value; // replace with validated & stripped values
        }
      }
    }

    if (errors.length > 0) {
      return next(ApiError.badRequest('Validation failed', errors));
    }

    next();
  };
};

module.exports = validate;
