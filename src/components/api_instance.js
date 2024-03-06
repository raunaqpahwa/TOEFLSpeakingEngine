import axios from "axios";

const instance = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        "Content-Type": 'application/json',
    }
});

export default instance;
