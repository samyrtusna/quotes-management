import http from "./httpService";

const getProducts = () => {
  return http.get(`/products/products/`);
};

const detailProduct = (id) => {
  return http.get(`/products/products/${id}/`);
};

const createProduct = (newObject) => {
  return http.post(`/products/products/`, newObject);
};

const updateProduct = (id, newObject) => {
  return http.put(`/products/products/${id}/`, newObject);
};

const deleteProduct = (id) => {
  return http.delete(`/products/products/${id}/`);
};

export default {
  getAll: getProducts,
  detail: detailProduct,
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,
};
