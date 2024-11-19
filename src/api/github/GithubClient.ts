import ApiClient from "../ApiClient";
import { Event, ListQuery, User } from "./types";

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
        Authorization: `${this.tokenPrefix} ${token}`
      }
    });
  }

  async getEvents(
    username: string,
    query: ListQuery
  ) : Promise<Event[]> {
    return this.get<Event[]>(`/users/${username}/events`, {
      params: query,
      headers: {
        Authorization: `${this.tokenPrefix} ${this.token}`
      }
    });
  }
}