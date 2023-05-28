import axios from 'axios';

export const getUser = async (id: string) => {
  try {
    const response = await axios.get(`/api/users`, { params: { id } });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const unsubscribeUser = async (id: string) => {
  try {
    const response = await axios.patch(
      `/api/users/unsubscribe`,
      {},
      { params: { id } },
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
