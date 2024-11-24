import { ApiAdapter, AccountType, User, Event, ListQuery } from "./types";
import GithubClient from "./github/GithubClient";
import GitlabClient from "./gitlab/GitlabClient";
import ApiClient, {ErrorData} from "./ApiClient";
import GithubAdapter from "./github/GithubAdapter";
import GitlabAdapter from "./gitlab/GitlabAdapter";

export default class ApiResolver {
  private m_Services: Record<AccountType, ApiClient>;
  private m_Adapters: Record<AccountType, ApiAdapter>;
  
  // Public props
  public activeService: AccountType|null;

  constructor() {
    this.activeService = null;
    this.m_Services = {
      Github: new GithubClient(),
      Gitlab: new GitlabClient()
    };

    this.m_Adapters = {
      Github: GithubAdapter,
      Gitlab: GitlabAdapter
    }
  }

  public get token() : string|undefined {
    if (!this.activeService) {
      return undefined;
    }

    return this.m_Services[this.activeService].token
  }

  public set token(value: string) {
    if (!this.activeService) {
      return;
    }

    this.m_Services[this.activeService].token = value;
  }

  // API methods

  public async check(token: string) : Promise<User> {
    if (!this.activeService) {
      throw new Error('Missing an active service!');
    }

    const apiUser = await this.m_Services[this.activeService].check(token);
    return this.m_Adapters[this.activeService].getUser(apiUser);
  }

  public async getEvents(username: string, query: ListQuery): Promise<Event[]> {
    if (!this.activeService) {
      throw new Error('Missing an active service!');
    }

    const events = await this.m_Services[this.activeService].getEvents(username, { page: 1, per_page: 10 });
    
    if (this.activeService === 'Gitlab') {
      throw new Error('Method not implemented!');
    }
    
    return events.map((event) => {
      if (!this.activeService) {
        throw new Error('Missing an active service!');
      }
      
      return this.m_Adapters[this.activeService].getEvent(event);
    })
  }
}