import {AccountType, User, Event, ListQuery, EditableUser, Repository} from "./types";
import GithubClient from "./github/client";
import GitlabClient from "./gitlab/client";
import ApiClient from "./ApiClient";
import {serializeListQuery} from "@src/api/github/utils";

export default class ApiResolver {
  private readonly m_Services: Record<AccountType, ApiClient>;

  // Public props
  public activeService: AccountType|null;

  constructor() {
    this.activeService = null;
    this.m_Services = {
      Github: new GithubClient(),
      Gitlab: new GitlabClient()
    };
  }

  public get activeClient(): ApiClient {
    if (!this.activeService) {
      throw new Error('Missing an active service!');
    }

    return this.m_Services[this.activeService];
  }

  public get token() : string|undefined {
    if (!this.activeService) {
      return undefined;
    }

    return this.activeClient.token;
  }

  public set token(value: string) {
    if (!this.activeService) {
      return;
    }

    this.activeClient.token = value;
  }

  public service(accountType: AccountType) {
    return this.m_Services[accountType];
  }

  // API methods

  public async check(token: string) : Promise<User> {
    return this.activeClient.check(token)
  }

  public async getEvents(username: string, query: ListQuery): Promise<Event[]> {
    const params = serializeListQuery(query);
    const events = await this.activeClient.getEvents(username, params);

    for (const event of events) {
      if (this.activeService === 'Gitlab' && event.repo) {
        const repo = await this.service('Gitlab').getRepository(event.repo.id);

        event.repo.name = repo.fullName;
        event.repo.url = repo.url;
      }
    }

    return events
  }

  public async getOwnerRepositories(query: ListQuery): Promise<Repository[]> {
    return this.activeClient.getAuthUserRepositories(query);
  }

  public async updateAuthUser(updateData: EditableUser): Promise<User> {
    return this.activeClient.updateAuthUser(updateData);
  }
}