import { User as GithubUser } from "./types";
import { User, ApiAdapter } from "../types";

const GithubAdapter: ApiAdapter = {
  getUser(user: GithubUser) : User {
    return {
      id: user.id,
      service: 'Github',
      username: user.login,
      fullname: user.name,
      avatarUrl: user.avatar_url,
      webUrl: user.html_url,
      company: user.company,
      location: user.location,
      email: user.email,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      createdAt: user.created_at
    } satisfies User;
  },
};

export default GithubAdapter;