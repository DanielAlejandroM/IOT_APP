import apiClient from "./apiClient"

export const registerUser = async (
    usuario: string,
    email: string,
    password: string
) => {
    const response = await apiClient.post("/auth/register", {
        usuario,
        email,
        password,
    });
    return response;
};

export const loginUser = async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login", {
        email,
        password,
    });
    return response.data;
};

export const getNearbyAlerts = async (lat: number, lng: number) => {

  const response = await apiClient.get(
    `/alerts/nearby?lat=${lat}&lng=${lng}&radio=1000`
  );

  return response.data.resultados;

};


export const respondToAlert = async (alertId: number) => {

  const response = await apiClient.post(
    `/alerts/${alertId}/respond`
  );

  return response.data;

};