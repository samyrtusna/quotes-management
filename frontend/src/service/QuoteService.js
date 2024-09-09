import http from "./httpService";

const getQuote = () => {
  return http.get(`/quotes/quotes/`);
};
const detailQuote = (id) => {
  return http.get(`/quotes/quotes/${id}/`);
};
const createQuote = (newObject) => {
  return http.get(`/quotes/quotes/save_quote/`, newObject);
};
const updateQuote = (id, newObject) => {
  return http.get(`/quotes/quotes/${id}/`, newObject);
};
const deleteQuote = (id) => {
  return http.get(`/quotes/quotes/${id}/`);
};

export default {
  getAll: getQuote,
  detail: detailQuote,
  create: createQuote,
  update: updateQuote,
  delete: deleteQuote,
};
