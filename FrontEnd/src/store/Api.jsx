// src/store/Api.jsx

// Base URL for the API
// const BASE_URL = 'https://66aa0b5b613eced4eba7559a.mockapi.io';
const BASE_URL = "http://localhost:8080/api";
const BASE_URL_TP = "https://64dc81fbe64a8525a0f699a1.mockapi.io/api/v1";
// Common API endpoints
const API = {
  SUBJECT: `${BASE_URL}/subject`,
  COURSE: `${BASE_URL}/khoa_hoc`,
  SCHEDULE: `${BASE_URL}/lich_hoc`,

  CLASS: `${BASE_URL}/class`,
  TRAINNING_PROGRAM: `${BASE_URL_TP}/trainin_program`,
  RESER: `${BASE_URL}/Bao_luu`,

  // Add other API endpoints here if needed
};

export default API;
