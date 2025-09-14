import axios from "axios";
const FAKE_STORE_API = "https://fakestoreapi.com";

export const api = axios.create({
    baseURL: FAKE_STORE_API,
});

