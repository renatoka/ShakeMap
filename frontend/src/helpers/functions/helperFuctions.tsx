import axios from 'axios';
import Joi from 'joi';

export const getEarthquakes = async (limit: number) => {
  try {
    const response = await axios.get(
      `http://localhost:3002/api/earthquakes-data`,
      {
        params: {
          limit,
        },
      },
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const validate = (data: any) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label('First Name'),
    lastName: Joi.string().required().label('Last Name'),
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } })
      .label('Email'),
  });
  const { error } = schema.validate(data);
  if (error) {
    console.log(error);
    return false;
  }
  return true;
};
