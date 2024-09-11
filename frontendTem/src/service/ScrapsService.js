import http from "./httpService";

const getScraps = () => {
  return http.get(`/scraps/scraps/`);
};

const detailScraps = (id) => {
  return http.get(`/scraps/scraps/${id}/`);
};

const createScraps = (newObject) => {
  return http.post(`/scraps/scraps/`, newObject);
};

const updateScraps = (id, newObject) => {
  return http.put(`/scraps/scraps/${id}/`, newObject);
};

const deleteScraps = (id) => {
  return http.delete(`/scraps/scraps/${id}/`);
};

export default {
  getAll: getScraps,
  detail: detailScraps,
  create: createScraps,
  update: updateScraps,
  delete: deleteScraps,
};
