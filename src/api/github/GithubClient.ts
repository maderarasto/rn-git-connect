import ApiClient from "../ApiClient";
import { User } from "./types";

export default class GithubClient extends ApiClient {

  constructor() {
    super({
      baseUrl: 'https://api.github.com',
      tokenPrefix: 'token',
    });
  }

  async check(token: string) : Promise<User> {
    return this.get<User>('/user', {
      headers: {
        Authorization: `token ${token}`
      }
    });
  }
}