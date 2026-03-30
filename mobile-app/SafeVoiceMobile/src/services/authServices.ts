import apiClient from "./apiClient"

export const registerUser = async (email: string, password: string) => {
    //// const response = await apiClient.post("/auth/register", {
    //    email,
    //   password,
    //});
    console.log("Mock register user:", email);
    return {
        //response.data;
        message: "Usuario creado correctamente"
    };
};

export const loginUser = async (email: string, password: string) => {
    //const response = await apiClient.post("/auth/login", {
    //    email,
    //    password,
    //});
    console
    return {
        accest_token: "mock-jwt-token",
        //response.data;
    };
};