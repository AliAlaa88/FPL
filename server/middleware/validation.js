import Joi from "joi";

/**
 * Generic validation middleware that validates request data against a Joi schema
 * @param {Object} schema - Joi schema object with optional body, params, query properties
 * @returns {Function} Express middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false, // Include all errors
      allowUnknown: true, // Ignore unknown keys
      stripUnknown: true, // Remove unknown keys
    };

    const errors = {};

    // Validate request body
    if (schema.body) {
      const { error, value } = schema.body.validate(
        req.body,
        validationOptions
      );
      if (error) {
        errors.body = error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        }));
      } else {
        req.body = value;
      }
    }

    // Validate request params
    if (schema.params) {
      const { error, value } = schema.params.validate(
        req.params,
        validationOptions
      );
      if (error) {
        errors.params = error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        }));
      } else {
        req.params = value;
      }
    }

    // Validate request query
    if (schema.query) {
      const { error, value } = schema.query.validate(
        req.query,
        validationOptions
      );
      if (error) {
        errors.query = error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        }));
      } else {
        req.query = value;
      }
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    next();
  };
};

export default validate;
