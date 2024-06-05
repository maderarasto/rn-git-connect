import ApiClient from "./ApiClient";
import { AuthUser } from "./types";

const GitHubClient = new ApiClient(
    'https://gitlab.com/api/v4'
);

const auth = {
    user: async function () {
        return GitHubClient.get<AuthUser>('/user');
    }
}

const GitLabAPI = {
    auth,
};

export default GitLabAPI;