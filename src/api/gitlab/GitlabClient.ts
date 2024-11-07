import ApiClient from "../ApiClient";
import { User } from "./types";

export default class GitlabClient extends ApiClient {
  constructor() {
    super({
      baseUrl: 'https://gitlab.com/api/v4',
    });
  }

  async check(token: string) : Promise<User> {
    return this.get<User>('/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}