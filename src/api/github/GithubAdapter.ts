import ApiAdapter from "../ApiAdapter";
import { 
  User, 
  Event, 
  EventType, 
  SimpleUser, 
  SimpleRepository, 
  EventPayload, 
  PushData, 
  Issue, 
  Label, 
  IssueComment, 
  MergeRequest, 
  ListQuery, 
  SimpleMergeRequest, 
  SimpleIssue 
} from "../types";
import {
  User as GithubUser,
  Actor as GithubActor,
  Repository as GithubRepository,
  SimpleRepository as GithubSimpleRepository,
  Label as GithubLabel,
  Issue as GithubIssue,
  IssueComment as GithubIssueComment,
  PullRequest as GithubPullRequest,
  PushEventPayload,
  IssuesEventPayload,
  CreateEventPayload,
  Event as GithubEvent,
  EventType as GithubEventType,
  ListQuery as GithubListQuery, DeleteEventPayload,
} from "./types";

type GithubEventPayload = (
  | PushEventPayload
  | IssuesEventPayload
  | CreateEventPayload
  | DeleteEventPayload
);

export default class GithubAdapter implements ApiAdapter {
  public getUser(user: GithubUser): User {
    return {
      id: user.id,
      service: 'Github',
      username: user.login,
      fullname: user.name,
      avatarUrl: user.avatar_url,
      webUrl: user.html_url,
      company: user.company,
      location: user.location,
      email: user.email,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      createdAt: user.created_at
    }
  }

  public getSimpleUser(user: GithubUser|GithubActor): SimpleUser {
    return {
      id: user.id,
      username: user.login,
      webUrl: user.url,
      avatarUrl: user.avatar_url
    };
  }

  public getSimpleRepository(repo: GithubRepository|GithubSimpleRepository): SimpleRepository {
    return {
      id: repo.id,
      name: repo.name,
      url: repo.url
    };
  }

  public getSimpleIssue(issue: GithubIssue): SimpleIssue {
    return {
      id: issue.id,
      number: issue.number,
      title: issue.title,
      state: issue.state
    }
  }

  public getSimpleMergeRequest(mergeRequest: GithubPullRequest): SimpleMergeRequest {
    return {
      id: mergeRequest.id,
      number: mergeRequest.number,
      title: mergeRequest.title,
      state: mergeRequest.state,
    };
  }

  public getEvent(event: GithubEvent): Event {
    return {
      id: event.id,
      type: this.resolveEventType(event.type ?? ''),
      user: this.getSimpleUser(event.actor),
      repo: this.getSimpleRepository(event.repo),
      payload: this.resolveEventPayload(event.type ?? '', event.payload),
      createdAt: event.created_at ?? '',
    }
  }

  public getLabel (label: GithubLabel): Label {
    return {
      id: label.id,
      name: label.name,
      description: label.description,
      color: label.color
    };
  }

  public getApiListQuery(params: ListQuery): GithubListQuery {
    return {
      page: params.page ?? 1,
      per_page: params.perPage ?? 10,
    };
  }

  // protected
  protected resolveEventType(eventType: string): EventType {
    let resolvedType: EventType = eventType as EventType 

    if (eventType === 'PullRequestEvent') {
      resolvedType = 'MergeRequestEvent';
    }

    return resolvedType;
  }

  protected resolveEventPayload(eventType: string, payload: GithubEventPayload): EventPayload {
    const resolvedType: GithubEventType = eventType as GithubEventType;

    if (resolvedType === 'CreateEvent') {
      payload.type = 'CreateEvent';
    } else if (resolvedType === 'DeleteEvent') {
      payload.type = 'DeleteEvent';
    } else if (resolvedType === 'PushEvent') {
      payload.type = 'PushEvent'
    } else {
      payload.type = 'IssuesEvent';
    }

    const resolvedPayload: EventPayload = {
      targetType: payload.type === 'CreateEvent' || payload.type === 'DeleteEvent' ? payload.ref_type : null,
      targetName: payload.type === 'PushEvent' || payload.type === 'CreateEvent' || payload.type === 'DeleteEvent'
          ? payload.ref : null,
    };

    if (payload.type === 'PushEvent') {
      const pushData: Partial<PushData> = {
        repoId: payload.repository_id,
        head: payload.head,
        commitCount: payload.commits.length,
      };

      if (payload.commits.length > 0) {
        pushData.commitTitle = payload.commits[0].message;
      }

      resolvedPayload.push = pushData as PushData;
    } else if (payload.type === 'IssuesEvent') {
      if (payload.issue) {
        resolvedPayload.issue = this.getIssue(payload.issue);
      }

      if (payload.comment) {
        resolvedPayload.comment = this.getIssueComment(payload.comment);
      }

      if (payload.pull_request) {
        resolvedPayload.mergeRequest = this.getMergeRequest(payload.pull_request);
      }
    }

    return resolvedPayload;
  }

  protected getIssue(issue: GithubIssue): Issue {
    return {
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body,
      labels: issue.labels.map((label) => this.getLabel(label)),
      state: issue.state, // open/closed
      commentCount: issue.comments,
      user: this.getSimpleUser(issue.user),
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      closedAt: issue.closed_at
    };
  }

  protected getMergeRequest(mergeRequest: GithubPullRequest): MergeRequest {
    return {
      id: mergeRequest.id,
      number: mergeRequest.number,
      assignee: mergeRequest.assignee ? this.getSimpleUser(mergeRequest.assignee) : null,
      assignees: mergeRequest.assignees.map((assignee) => this.getSimpleUser(assignee)),
      autoMerge: mergeRequest.auto_merge,
      body: mergeRequest.body,
      changedFiles: mergeRequest.changed_files,
      commentCount: mergeRequest.comments,
      commentsUrl: mergeRequest.comments_url,
      commitCount: mergeRequest.commits,
      commitsUrl: mergeRequest.commits_url,
      deletions: mergeRequest.deletions,
      draft: mergeRequest.draft,
      diffUrl: mergeRequest.diff_url,
      issueUrl: mergeRequest.issue_url,
      labels: mergeRequest.labels.map((label) => this.getLabel(label)),
      locked: mergeRequest.locked,
      merged: mergeRequest.merged,
      mergedAt: mergeRequest.merged_at,
      mergedBy: mergeRequest.merged_by,
      rebaseable: mergeRequest.rebaseable,
      requestedReviewers: mergeRequest.requested_reviewers.map((reviewer) => this.getSimpleUser(reviewer)),
      requestedTeams: mergeRequest.requested_teams,
      reviewCommentUrl: mergeRequest.review_comment_url,
      reviewCommentCount: mergeRequest.review_comments,
      reviewCommentsUrl: mergeRequest.review_comments_url,
      state: mergeRequest.state,
      title: mergeRequest.title,
      user: this.getSimpleUser(mergeRequest.user),
      createdAt: mergeRequest.created_at,
      updatedAt: mergeRequest.updated_at,
      closedAt: mergeRequest.closed_at,
    };
  }

  protected getIssueComment(comment: GithubIssueComment): IssueComment {
    return {
      id: comment.id,
      body: comment.body,
      user: this.getSimpleUser(comment.user),
      url: comment.url,
      htmlUrl: comment.html_url,
      issueUrl: comment.issue_url,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
    };
  }
}