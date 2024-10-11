import http from "./httpService";

const getQuote = () => {
  return http.get(`/quotes/quotes/`);
};
const detailQuote = (id) => {
  return http.get(`/quotes/quotes/${id}/`);
};
const createQuote = (newObject) => {
  return http.post(`/quotes/quotes/save_quote/`, newObject);
};
const updateQuote = (id, newObject) => {
  return http.put(`/quotes/quotes/${id}/`, newObject);
};
const patchQuote = (id, newObject) => {
  return http.patch(`/quotes/quotes/${id}/`, newObject);
};
const deleteQuote = (id) => {
  return http.delete(`/quotes/quotes/${id}/`);
};

export default {
  getAll: getQuote,
  detail: detailQuote,
  create: createQuote,
  update: updateQuote,
  patch: patchQuote,
  delete: deleteQuote,
};
