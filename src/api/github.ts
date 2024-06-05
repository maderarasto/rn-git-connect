import axios from "axios";
import ApiClient from "./ApiClient";
import { AuthUser } from "./types";

const GitHubClient = new ApiClient(
    'https://api.github.com'
);

const auth = {
    user: async function () {
        return GitHubClient.get<AuthUser>('/user');
    }
}

const GitHubAPI = {
    auth,
};

export default GitHubAPI;