import { api } from "../../../api/api";

export const fetchOcrDocuments = async (userId: number) => {
  try {
    const res = await api.get(
      `/ocr/analyse/${userId}`
    );

    console.log(res.data); // debug

    // ✅ garantir un tableau
    const data = Array.isArray(res.data)
      ? res.data
      : [res.data];

    return data;
  } catch (error) {
    console.error("Erreur fetch projects:", error);
    return [];
  }
};
export const analyseDocument = async (
  id: number,
  documentType: string,
  contactId:number
) => {
  try {
    const res = await api.post(
      `/ocr/analyze/`,
      {
        id,documentType,contactId
      }
    );

    return res.data;
  } catch (error) {
    console.error(
      "Erreur analyse OCR :",
      error,
    );
    throw error;
  }
};
export const verifyExistence = async (
  id: number,
  documentType: string,
) => {
  try {
    const res = await api.post(
      "/ocr/verify",
      {
        id,
        documentType,
      },
    );

    return res.data.analyzed;
  } catch (error) {
    console.error(
      "Erreur vérification OCR:",
      error,
    );

    throw error;
  }
};