import axios from 'axios';
import Joi from 'joi';
import { ValidateResponse } from '../../interfaces';

export const getEarthquakes = async (limit: number) => {
  try {
    const response = await axios.get(`/api/earthquakes-data`, {
      params: {
        limit,
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const validate = (data: any) => {
  const response: ValidateResponse = {
    success: false,
    errors: [
      {
        message: '',
        path: '',
        context: {
          key: '',
          label: '',
          value: '',
        },
        type: '',
      },
    ],
  };

  const schema = Joi.object({
    firstName: Joi.string()
      .required()
      .label('firstName')
      .min(2)
      .max(30)
      .messages({
        'string.min': 'First name must be at least {{#limit}} characters long',
        'string.max':
          'firstName must be less than or equal to {{#limit}} characters long',
        'string.empty': 'firstName cannot be an empty field',
      }),
    lastName: Joi.string()
      .required()
      .label('lastName')
      .min(2)
      .max(30)
      .messages({
        'string.min': 'Last name must be at least {{#limit}} characters long',
        'string.max':
          'lastName must be less than or equal to {{#limit}} characters long',
        'string.empty': 'lastName cannot be an empty field',
      }),
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } })
      .label('email')
      .messages({
        'string.email': 'Email must be in the correct format',
      }),
  });
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    response.success = false;
    error.details.forEach((err) => {
      response.errors.push({
        message: err.message,
        path: err.path[0],
        type: err.type,
        context: err.context as {
          key: string;
          label: string;
          value: string;
        },
      });
    });
    return response;
  }
  response.success = true;
  return response;
};
