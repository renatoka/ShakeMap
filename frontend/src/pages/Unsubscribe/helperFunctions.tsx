import axios from 'axios';

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
      { params: { id }, headers: { Authorization: `Bearer ${token}` }}
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
