import { api } from "@/app/api/api";
import React from "react";

export const generateDashboardPdf = async (
  userId: number,
 year: number,
  setPdfFile: React.Dispatch<
    React.SetStateAction<File | null>
  >,
  setOpenShareModal: React.Dispatch<
    React.SetStateAction<boolean>
  >
) => {
  try {

    const response = await api.post(
      "/pdf/dashboard",
      {
        userId,
        year,
      },
      {
        responseType: "blob",
      }
    );

    const file = new File(
      [response.data],
      `dashboard-report-${year}.pdf`,
      {
        type: "application/pdf",
      }
    );

    setPdfFile(file);

    setOpenShareModal(true);

  } catch (error) {

    console.error(
      "PDF generation error:",
      error
    );

  }
};
export const sendDashboardEmail = async (
  pdfFile: File,
  email: string,
  subject: string,
  message: string
) => {
  try {
    const formData = new FormData();

    formData.append("file", pdfFile);
    formData.append("email", email);
    formData.append("subject", subject);
    formData.append("message", message);

    const response = await api.post(
      "/pdf/send-dashboard",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Email sending error:",
      error
    );
    throw error;
  }

};
  export const fetchDashboard = async (
  userId: number,
) => {
  const response = await api.get(
    `/bi/dashboard/${userId}`,
  );

  return response.data;
};
export const downloadDashboardPdf = async (
  userId: number,
  year: number,
) => {
 const language = localStorage.getItem("language") ;
console.log(language)
  try {

    const response = await api.post(
      "/pdf/download-dashboard",
      {
        userId,
        year,
        language
      },
      {
        responseType: "blob",
      }
    );

    const url =
      window.URL.createObjectURL(
        new Blob([response.data])
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `dashboard-${year}.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {

    console.error(
      "Download PDF error:",
      error
    );

  }

};