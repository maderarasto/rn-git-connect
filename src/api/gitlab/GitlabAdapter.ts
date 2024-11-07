import { User as GitlabUser } from "./types";
import { User, ApiAdapter } from "../types";

const GitlabAdapter: ApiAdapter = {
  getUser(user: GitlabUser) : User {
    return {
      id: user.id,
      service: 'Gitlab',
      username: user.username,
      fullname: user.name,
      avatarUrl: user.avatar_url,
      webUrl: user.web_url,
      company: user.organization,
      location: user.location ?? '',
      email: user.email ?? '',
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      createdAt: user.created_at
    } satisfies User;
  },
};

export default GitlabAdapter;