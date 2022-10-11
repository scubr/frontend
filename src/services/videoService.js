import http from './httpService';
import axios from 'axios';

const apiEndpoint = `${process.env.REACT_APP_BASEURL}/videos`;

export const uploadToTheta = (videoData, setUploadProgress) => {
  var config = {
    method: 'post',
    url: 'https://scubr.herokuapp.com/api/videos/new',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    data: videoData,
    onUploadProgress: function (progressEvent) {
      setUploadProgress(
        Math.round((progressEvent.loaded / progressEvent.total) * 100)
      );
    },
  };

  return axios(config);
};

export const uploadVideo = (videoUrl, title, caption) => {
  const video = {
    title,
    caption,
    videoUrl,
  };

  return http.post(apiEndpoint, video);
};

export const getAllVideos = async () => {
  const response = await http.get(`${apiEndpoint}?sort=recent`);
  if (response.status === 200) {
    return response.data;
  }
  return null;
};

export const getVideoById = async (id) => {
  return http.get(`${apiEndpoint}/${id}/details`);
};

export const addViewToVideo = async (id) => {
  const response = await http.post(`${apiEndpoint}/${id}/view`);
  return response.status;
};

export const likeAVideo = async (id) => {
  const response = await http.post(`${apiEndpoint}/${id}/like`);
  return response.status;
};

export const unlikeAVideo = async (id) => {
  const response = await http.post(`${apiEndpoint}/${id}/unlike`);
  return response.status;
};

export const saveAVideo = async (id) => {
  const response = await http.post(`${apiEndpoint}/${id}/save`);
  return response.status;
};

export const unsaveAVideo = async (id) => {
  const response = await http.post(`${apiEndpoint}/${id}/unsave`);
  return response.status;
};

export const commentOnAVideo = (id, comment) => {
  return http.post(`${apiEndpoint}/${id}/comment`, { comment });
};

export const getAllCommentsOnAVideo = (id) => {
  return http.get(`${apiEndpoint}/${id}/comments`);
};
