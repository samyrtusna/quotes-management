import http from "./httpService";

const getProductDetails = () => {
  return http.get(`/product_details/product_details/`);
};

const productDetail = (id) => {
  return http.get(`/product_details/product_details/${id}/`);
};

const createProductDetail = (newObject) => {
  return http.post(`/product_details/product_details/`, newObject);
};

const updateProductDetail = (id, newObject) => {
  return http.put(`/product_details/product_details/${id}/`, newObject);
};

const deleteProductDetail = (id) => {
  return http.delete(`/product_details/product_details/${id}/`);
};

export default {
  getAll: getProductDetails,
  detail: productDetail,
  create: createProductDetail,
  update: updateProductDetail,
  delete: deleteProductDetail,
};
