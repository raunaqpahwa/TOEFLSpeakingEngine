import axios from "axios";

const instance = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        "Content-Type": 'application/json',
        Authorization: 'Bearer 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'
    }
});

export default instance;