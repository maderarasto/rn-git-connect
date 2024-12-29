import ApiClient from "../ApiClient";
import {User, Repository, Event, EditableUser} from "../types";
import {
  ListParams,
  Event as GithubEvent,
  Repository as GithubRepository,
  User as GithubUser, SearchReposParams, SearchRepositoryResult
} from "./types";
import * as GithubUtils from "@src/api/github/utils";
import {serializeSearchReposParams} from "@src/api/github/utils";

export default class GithubClient extends ApiClient {

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

    return GithubUtils.deserializeUser(user);
  }

  async getRepository(id: number): Promise<Repository> {
    const repository = await this.get<GithubRepository>(`/repositories/${id}`, {
      headers: {
        Authorization: `${this.tokenPrefix} ${this.token}`
      }
    });

    return GithubUtils.deserializeRepository(repository);
  }

  async getEvents(
    username: string,
    query: ListParams
  ) : Promise<Event[]> {
    const events = await this.get<GithubEvent[]>(`/users/${username}/events`, {
      params: query,
      headers: {
        Authorization: `${this.tokenPrefix} ${this.token}`
      }
    });

    return events.map((event) => {
      return GithubUtils.deserializeEvent(event);
    });
  }

  async updateAuthUser(updateData: EditableUser): Promise<User> {
    const response = await this.patch<GithubUser>('/user', updateData, {
      headers: {
        Authorization: `${this.tokenPrefix} ${this.token}`
      }
    });

    return GithubUtils.deserializeUser(response.data);
  }

  async getAuthUserRepositories(query: Record<string, any>): Promise<Repository[]> {
    const repos = await this.get<GithubRepository[]>('user/repos', {
      params: GithubUtils.serializeListParams(query),
      headers: {
        Authorization: `${this.tokenPrefix} ${this.token}`
      }
    });

    return repos.map((repo) => {
      return GithubUtils.deserializeRepository(repo);
    });
  }

  async searchRepositories(params: SearchReposParams): Promise<Repository[]> {
    const result = await this.get<SearchRepositoryResult>('search/repositories', {
      params: serializeSearchReposParams(params),
      headers: {
        Authorization: `${this.tokenPrefix} ${this.token}`
      }
    });

    return result.items.map((repository) => {
      return GithubUtils.deserializeRepository(repository);
    });
  }
}