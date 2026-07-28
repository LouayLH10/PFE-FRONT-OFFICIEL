import { api } from "@/app/api/api";

export const formatTND = (
  amount: number | string
): string => {
  const value = Number(amount);

  if (isNaN(value)) return "0,000 TND";

  return (
    value
      .toLocaleString("fr-FR", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })
      .replace(/\u202F/g, " ") // espace fine insécable
      .replace(/\u00A0/g, " ") // espace insécable
      + " TND"
  );
};
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};
export const updateLanguage = async (language: string) => {
  const token = localStorage.getItem("token");

  return api.put(
    `/users/language`,
    { language },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};