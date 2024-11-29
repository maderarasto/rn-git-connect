import ApiClient from "../ApiClient";
import { Event, Project, User } from "./types";

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

  async getRepository(id: number) : Promise<Project> {
    return this.get<Project>(`/projects/${id}`, {
      headers: {
        Authorization: `${this.tokenPrefix} ${this.token}`
      }
    });
  }

  async getEvents(username: string, query: Record<string, any>): Promise<Event[]> {
    return this.get<Event[]>(`/users/${username}/events`, {
      params: query,
      headers: {
        Authorization: `${this.tokenPrefix} ${this.token}`
      }
    });
  }
}