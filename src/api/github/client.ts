import ApiClient from "../ApiClient";
import { User, Repository, Event } from "../types";
import {
  ListQuery,
  Event as GithubEvent,
  Repository as GithubRepository,
  User as GithubUser
} from "./types";
import {deserializeEvent, deserializeRepository, deserializeUser} from "@src/api/github/utils";

export default class Client extends ApiClient {

  constructor() {
    super({
      baseUrl: 'https://api.github.com',
      tokenPrefix: 'token',
    });
  }

  async check(token: string) : Promise<User> {
    const user = await this.get<GithubUser>('/user', {
      headers: {
        Authorization: `${this.tokenPrefix} ${token}`
      }
    });

    return deserializeUser(user);
  }

  async getRepository(id: number): Promise<Repository> {
    const repository = await this.get<GithubRepository>(`/repositories/${id}`, {
      headers: {
        Authorization: `${this.tokenPrefix} ${this.token}`
      }
    });

    return deserializeRepository(repository);
  }

  async getEvents(
    username: string,
    query: ListQuery
  ) : Promise<Event[]> {
    const events = await this.get<GithubEvent[]>(`/users/${username}/events`, {
      params: query,
      headers: {
        Authorization: `${this.tokenPrefix} ${this.token}`
      }
    });

    return events.map((event) => deserializeEvent(event));
  }
}