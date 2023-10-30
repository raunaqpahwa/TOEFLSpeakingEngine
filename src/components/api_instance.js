import axios from "axios";

const instance = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        "Content-Type": 'application/json',
        Authorization: 'Bearer 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'
    }
});

export default instance;