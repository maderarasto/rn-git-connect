import ApiClient from "../ApiClient";
import {User, Repository, Event, EditableUser, SearchReposParams} from "../types";
import {
  User as GitlabUser,
  Project as GitlabProject,
  Event as GitlabEvent, ListParams
} from "./types";
import * as GitlabUtils from "@src/api/gitlab/utils";
import {serializeSearchProjectsParams} from "@src/api/gitlab/utils";

export default class GitlabClient extends ApiClient {
  constructor() {
    super({
      baseUrl: 'https://gitlab.com/api/v4',
    });
  }

  async check(token: string) : Promise<User> {
    const user = await this.get<GitlabUser>('/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return GitlabUtils.deserializeUser(user);
  }

  async getRepository(id: number) : Promise<Repository> {
    const project = await this.get<GitlabProject>(`/projects/${id}`, {
      headers: {
        Authorization: `${this.tokenPrefix} ${this.token}`
      }
    });

    return GitlabUtils.deserializeRepository(project);
  }

  async getEvents(username: string, query: Record<string, any>): Promise<Event[]> {
    const events = await this.get<GitlabEvent[]>(`/users/${username}/events`, {
      params: query,
      headers: {
        Authorization: `${this.tokenPrefix} ${this.token}`
      }
    });

    return events.map((event) => {
      return GitlabUtils.deserializeEvent(event);
    });
  }

  async getAuthUserRepositories(query: ListParams): Promise<Repository[]> {
    const repos = await this.get<GitlabProject[]>('/projects', {
      params: {
        ...GitlabUtils.serializeListParams(query),
        membership: true
      },
      headers: {
        Authorization: `${this.tokenPrefix} ${this.token}`
      }
    });

    return repos.map((project) => {
      return GitlabUtils.deserializeRepository(project);
    });
  }

  updateAuthUser(updateData: EditableUser): Promise<User> {
    throw new Error("Method not supported.");
  }

  async searchRepositories(params: SearchReposParams): Promise<Repository[]> {
    const projects = await this.get<GitlabProject[]>('/projects', {
      params: serializeSearchProjectsParams(params),
      headers: {
        Authorization: `${this.tokenPrefix} ${this.token}`
      }
    });

    return projects.map((project) => {
      return GitlabUtils.deserializeRepository(project);
    });
  }
}