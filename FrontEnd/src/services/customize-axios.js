import axios from "axios";
const instance = axios.create({
    baseURL: 'https://64dc81fbe64a8525a0f699a1.mockapi.io/api/v1/trainin_program?page=1'
});
// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});
export default instance;