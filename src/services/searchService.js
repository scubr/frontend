import http from './httpService';

const apiEndpoint = `${process.env.REACT_APP_BASEURL}/search`;

export const searchVideos = async (searchTerm) => {
    const { data } = await http.get(`${apiEndpoint}/videos?term=${searchTerm}`);
    return data;
}

export const searchAccounts = async (searchTerm) => {
    const { data } = await http.get(`${apiEndpoint}/accounts?term=${searchTerm}`);
    return data;
}

export const getTopAccountsAndVideos = async () => {
    const { data } = await http.get(`${apiEndpoint}/top`);
    return data;
}