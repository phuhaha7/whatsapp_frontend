import axios from 'axios';

const instance = axios.create({
    baseURL: "https://whatapps-backend.herokuapp.com/"
});

export default instance;