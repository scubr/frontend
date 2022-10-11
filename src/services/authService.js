import http from './httpService';

const apiEndpoint = `${process.env.REACT_APP_BASEURL}/auth`;

export const login = (data) => {
  return http.post(apiEndpoint, data);
};
