import { 
  Event, 
  Label, 
  ListQuery, 
  SimpleIssue, 
  SimpleMergeRequest, 
  SimpleRepository, 
  SimpleUser, 
  User 
} from "./types";

export default interface ApiAdapter {
  // getEvent: (event: any) => Event
  // getApiListQuery: (query: ListQuery) => Record<string, any>

  /**
   *  Get resolved user from api user
   *  @param user api user
   */
  getUser(user: any): User;

  /**
   * Get resolved simple user from api user
   * 
   * @param user api user
   */
  getSimpleUser(user: any): SimpleUser;

  /**
   * Get a resolved simple repository from api repository
   * 
   * @param repository api repository
   */
  getSimpleRepository(repository: any): SimpleRepository;

  /**
   * Get a resolved simple issue from api issue.
   * 
   * @param issue api issue
   */
  getSimpleIssue(issue: any): SimpleIssue;

  /**
   * Get a resolved simple merge request from api merge request
   * 
   * @param mergeRequest api merge request
   */
  getSimpleMergeRequest(mergeRequest: any): SimpleMergeRequest;

  /**
   * Get a resolved label from api label.
   * 
   * @param label api label
   */
  getLabel(label: any): Label;

  /**
   * Get a resolved event from api event.
   * 
   * @param event api event
   */
  getEvent(event: any): Event;

  /**
   * Get a resolved list query params for api client.
   * 
   * @param params general list query params in app.
   */
  getApiListQuery(params: ListQuery): Record<string, any>;
}