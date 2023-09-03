import {
  ColouringServiceProps,
  RotatingSpeedHelperProps,
  ValidateResponseProps,
} from '../interfaces';
import axios from 'axios';
import Joi from 'joi';

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
  const response: ValidateResponseProps = {
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

export const getUser = async (id: string, token: string) => {
  try {
    const response = await axios.get(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const unsubscribeUser = async (id: string, token: string) => {
  try {
    const response = await axios.patch(
      `/api/users/unsubscribe/${id}`,
      {},
      { params: { id }, headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const capitalizeString = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const colourMarker = ({ magnitude }: ColouringServiceProps) => {
  switch (true) {
    case magnitude >= 0 && magnitude < 1:
      return 'lightgreen';
    case magnitude >= 1 && magnitude < 2:
      return '#79ab4a';
    case magnitude >= 2 && magnitude < 3:
      return '#c0d731';
    case magnitude >= 3 && magnitude < 4:
      return '#ffc20f';
    case magnitude >= 4 && magnitude < 5:
      return '#f7941f';
    case magnitude >= 5 && magnitude < 6:
      return '#f46f2c';
    case magnitude >= 6 && magnitude < 7:
      return '#f0452b';
    case magnitude >= 7 && magnitude < 8:
      return '#ea1c29';
    case magnitude >= 8 && magnitude < 9:
      return '#d6186e';
    case magnitude >= 9:
      return '#d6186e';
  }
};

export const determineRotateSpeed = ({ zoom }: RotatingSpeedHelperProps) => {
  switch (true) {
    case zoom >= 2 && zoom < 3:
      return 30;
    case zoom >= 3 && zoom < 4:
      return 25;
    case zoom >= 4 && zoom < 5:
      return 20;
    case zoom >= 5 && zoom < 6:
      return 15;
    case zoom >= 6 && zoom < 7:
      return 10;
    case zoom >= 7 && zoom < 8:
      return 8;
    case zoom >= 8 && zoom < 9:
      return 5;
    case zoom >= 9:
      return 2;
    default:
      return 35;
  }
};
