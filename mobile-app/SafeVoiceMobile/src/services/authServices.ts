import apiClient from "./apiClient"

export const registerUser = async (email: string, password: string) => {
const response = await apiClient.post("/auth/register", {
    email,
    password,
});
return response.data;
}  

export const loginUser = async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login", {
        email,
        password,
    });
    return response.data;
};