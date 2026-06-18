import { api } from "@/app/api/api";
import React from "react";

export const generateDashboardPdf = async (
  dashboardRef: React.RefObject<HTMLDivElement | null>,
  setPdfFile: React.Dispatch<React.SetStateAction<File | null>>,
  setOpenShareModal: React.Dispatch<React.SetStateAction<boolean>>,
  setIsPdfMode: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    if (!dashboardRef.current) return;

    // Active le mode PDF
    setIsPdfMode(true);

    // Attend le rerender React
    await new Promise((resolve) =>
      setTimeout(resolve, 2000)
    );

    if (!dashboardRef.current) return;

    const html = dashboardRef.current.outerHTML;

    console.log("PDF HTML:", html);

    const response = await api.post(
      "/pdf/dashboard",
      { html },
      {
        responseType: "blob",
      }
    );

    const file = new File(
      [response.data],
      "dashboard-report.pdf",
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
  } finally {
    // Toujours revenir au mode normal
    setIsPdfMode(false);
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