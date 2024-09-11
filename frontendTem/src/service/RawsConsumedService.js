import http from "./httpService";

const getRaws = () => {
  return http.get(`/raw_products/raws_consumed/`);
};

const detailRaws = (id) => {
  return http.get(`/raw_products/raws_consumed/${id}/`);
};

const createRaws = (newObject) => {
  return http.post(`/raw_products/raws_consumed/`, newObject);
};

const updateRaws = (id, newObject) => {
  return http.put(`/raw_products/raws_consumed/${id}/`, newObject);
};

const deleteRaws = (id) => {
  return http.delete(`/raw_products/raws_consumed/${id}/`);
};

export default {
  getAll: getRaws,
  detail: detailRaws,
  create: createRaws,
  update: updateRaws,
  delete: deleteRaws,
};
