const axios = require('axios');
const createError = require('http-errors');

axios.interceptors.response.use(
    response => {
        return response.data;
    },
    () => {
        throw new createError(500, 'Unable to connect to this service!', { expose: true });
    }
);

module.exports = async (method, url) => {
    return await axios({
        url,
        method,
    });
};
