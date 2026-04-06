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
