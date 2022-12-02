import axios from 'axios';

const instance = axios.create({
    baseURL: "https://rabid-dinosaurs-production.up.railway.app/"
});

export default instance;