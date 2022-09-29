import axios from 'axios';

export const URL = import.meta.env.VITE_REST_URL;

const instance = axios.create({
    baseURL: URL,
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const callApi = async (url, data = {}, method = 'post', params) => {
    try {
        const config = {
            method,
            url,
            data,
            params,
        };
        const res = await instance(config);
        return { success: true, result: res?.data };
    } catch (e) {
        return { success: false, result: e?.response?.data };
    }
};

export const callApiGET = async (path, params) => callApi(path, {}, 'get', params);

export const callApiPOST = async (path, data, params) => callApi(path, data, 'post', params);