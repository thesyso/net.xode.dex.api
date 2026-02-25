import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from "axios";
import 'dotenv/config'; // For loading environment variables

import { moMessage } from './modules/message.js';
// Create a CancelToken source
const cancelTokenSource = axios.CancelToken.source();

// axios instance
const axiosIns: AxiosInstance = axios.create({
    baseURL: process.env.SERVER_RAPI_ADDRESS || 'http://localhost:8081',
    cancelToken: cancelTokenSource.token
});

// default config
axiosIns.defaults.headers.post["Content-Type"] = "application/json";

// Optional: Function to cancel all ongoing requests for this instance
export const axiosInsClose = (message: string = 'Request was canceled by user') => {
    cancelTokenSource.cancel(message);
};

// axiosIns.interceptors.request.use
// axiosIns.interceptors.request.use(
//     (req: AxiosRequestConfig) => {
//         // console.log('req session ', req.session); // req.session is not a standard AxiosRequestConfig property. You might need to extend AxiosRequestConfig if you use it.
//         return req;
//     },
//     (error: any) => { // Using 'any' for error as its type can vary
//         console.log('request. error', error);
//         // Perform action with request error
//         return Promise.reject(error);
//     }
// );
axiosIns.interceptors.request.use(
    <T extends AxiosRequestConfig>(req: T) => { // Use a generic type that extends AxiosRequestConfig
        // console.log('req session ', req.session); // If you uncomment this, you'll need to define a custom interface for AxiosRequestConfig that includes 'session'
        return req;
    },
    (error: any) => { // Using 'any' for error as its type can vary
        console.log('request. error', error);
        // Perform action with request error
        return Promise.reject(error);
    }
);


// axiosIns.interceptors.response.use
axiosIns.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status === 200) {
            // const res = response.data; // This line is not needed as response.data is directly returned
            return response.data;
        } else {
            console.log("axiosIns.interceptors.response.use - Status not 200", response);
        }
        return response; // In case status is not 200, but you still want to pass the response
    },
    async (error: any) => { // Using 'any' for error as its type can vary
        console.error("axiosIns.interceptors.response.use - Error in response", error);
        return Promise.reject(error);
    }
);

export {
    axiosIns
};