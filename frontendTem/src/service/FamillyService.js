import http from "./httpService";

const getProductsFamilly = () => {
  return http.get(`/products_familly/products_familly/`);
};

const detailProductFamilly = (id) => {
  return http.get(`/products_familly/products_familly/${id}/`);
};

const createProductFamilly = (newObject) => {
  return http.post(`/products_familly/products_familly/`, newObject);
};

const updateProductFamilly = (id, newObject) => {
  return http.put(`/products_familly/products_familly/${id}/`, newObject);
};

const deleteProductFamilly = (id) => {
  return http.delete(`/products_familly/products_familly/${id}/`);
};

export default {
  getAll: getProductsFamilly,
  detail: detailProductFamilly,
  create: createProductFamilly,
  update: updateProductFamilly,
  delete: deleteProductFamilly,
};
