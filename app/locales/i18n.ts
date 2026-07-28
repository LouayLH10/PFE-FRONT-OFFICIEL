// app/i18n.ts

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import dashboardEn from "./en/dashboard.json";
import dashboardFr from "./fr/dashboard.json";
import sidebarEN from "./en/sidebar.json"
import sidebarFR from "./fr/sidebar.json"
import navbarFR from "./fr/navbar.json"
import navbarEN from "./en/navbar.json"
import quoteFR from "./fr/quotes.json"
import quoteEN from "./en/quotes.json"
import orderEN from "./en/order.json"
import orderFR from "./fr/order.json"
import DnFR from "./fr/deliverynote.json"
import DnEN from "./en/deliverynote.json"
import invoiceFR from "./fr/invoice.json"
import invoiceEN from "./en/invoice.json"
import paymentEN from "./en/payment.json"
import paymentFR from "./fr/payment.json"
import projectEN from "./en/project.json"
import projectFR from "./fr/project.json"
import documentEN from "./en/iaDocument.json"
import documentFR from "./fr/iaDocument.json"
const language =
  typeof window !== "undefined"
    ? localStorage.getItem("language") || "en"
    : "en";
i18n.use(initReactI18next).init({
  lng: language,
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },

  resources: {
    en: {
      dashboard: dashboardEn,
      sidebar:sidebarEN,
      navbar:navbarEN,
      quotes:quoteEN,
      order:orderEN,
      deliveryNote:DnEN,
      invoice:invoiceEN,
      payment:paymentEN,
      project:projectEN,
      iaDocument:documentEN
    },

    fr: {
      dashboard: dashboardFr,
      sidebar:sidebarFR,
      navbar:navbarFR,
      quotes:quoteFR,
      order:orderFR,
      deliveryNote:DnFR,
      invoice:invoiceFR,
      payment:paymentFR,
      project:projectFR,
      iaDocument:documentFR
    },
  },
});

export default i18n;