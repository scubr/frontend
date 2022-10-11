import http from './httpService';

const apiEndpoint = `${process.env.REACT_APP_BASEURL}/accounts`;

export const createAccount = (data) => {
  return http.post(apiEndpoint, data);
};

export const checkAlreadyRegistered = (data) => {
  return http.get(`${apiEndpoint}?publicAddress=${data.publicAddress}`);
};

export const getNonce = (data) => {
  return http.get(`${apiEndpoint}/nonce?publicAddress=${data.publicAddress}`);
};

export const getAccountDetails = (id) => {
  return http.get(`${apiEndpoint}/${id}/details`);
};


export const followAnAccount = async (id) => {
  return http.post(`${apiEndpoint}/${id}/follow`);
}

export const unfollowAnAccount = async (id) => {
  return http.post(`${apiEndpoint}/${id}/unfollow`);
}

export const getAllOwnedVideos = async (id) => {
  const response = await http.get(`${apiEndpoint}/${id}/owned`);
  return response.data;
}

export const getAllLikedVideos = async (id) => {
  const response = await http.get(`${apiEndpoint}/${id}/liked`);
  return response.data;
}

export const getAllSavedVideos = async (id) => {
  const response = await http.get(`${apiEndpoint}/${id}/saved`);
  return response.data;
}

export const getAllFollowers = async (id) => {
  const response = await http.get(`${apiEndpoint}/${id}/followers`);
  return response.data;
}

export const getAllFollowing = async (id) => {
  const response = await http.get(`${apiEndpoint}/${id}/followings`);
  return response.data;
}

export const updateAccount = async (id, data) => {
  return http.put(`${apiEndpoint}/${id}/details`, data);
}