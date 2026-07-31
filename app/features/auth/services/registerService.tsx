import { api } from "../../../api/api";



export const registerService = async (email: string, password: string,name:string) => {
  const response = await api.post("/auth/register", {
        name,
        email,
        password,
  });
console.log(response)
  return response.data;
};