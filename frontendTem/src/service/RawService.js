import http from "./httpService";

const getRawProducts = () => {
  return http.get(`/raw_products/raw_products/`);
};

const detailRawProduct = (id) => {
  return http.get(`/raw_products/raw_products/${id}/`);
};

const createRawProduct = (newObject) => {
  return http.post(`/raw_products/raw_products/`, newObject);
};

const updateRawProduct = (id, newObject) => {
  return http.put(`/raw_products/raw_products/${id}/`, newObject);
};

const deleteRawProduct = (id) => {
  return http.delete(`/raw_products/raw_products/${id}/`);
};

export default {
  getAll: getRawProducts,
  detail: detailRawProduct,
  create: createRawProduct,
  update: updateRawProduct,
  delete: deleteRawProduct,
};
