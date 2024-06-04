import { AxiosError } from "axios";
import ApiClient from "./ApiClient";

const GitHubClient = new ApiClient(
    'https://api.github.com'
);

const auth = {
    user: async function () {
       return await GitHubClient.get('/user');
    }
}

const GitHubAPI = {
    auth,
};

export default GitHubAPI;