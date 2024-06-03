import axios from "axios";

export const GitHubAxios = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
        Accept: 'application/json',
    },
    timeout: 3000,
});

export const GitHubUsers = {
    getAuthUser: function () {

    }
}