import http from "./httpService";

const getQuoteDetails = () => {
  return http.get(`/quotes/quote_details/`);
};
const detailQuoteDetails = (id) => {
  return http.get(`/quotes/quote_details/${id}/`);
};
const createQuoteDetails = (newObject) => {
  return http.get(`/quotes/quote_details/`, newObject);
};
const updateQuoteDetals = (id, newObject) => {
  return http.get(`/quotes/quote_details/${id}/`, newObject);
};
const deleteQuoteDetails = (id) => {
  return http.get(`/quotes/quote_details/${id}/`);
};
export default {
  getAll: getQuoteDetails,
  detail: detailQuoteDetails,
  create: createQuoteDetails,
  update: updateQuoteDetals,
  delete: deleteQuoteDetails,
};
