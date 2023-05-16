import axios from 'axios';

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
