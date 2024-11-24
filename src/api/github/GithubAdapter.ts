import { User, Event, ApiAdapter, EventType, SimpleUser, SimpleRepository, EventPayload, PushData, Issue, Label, IssueComment, MergeRequest, ListQuery } from "../types";
import { 
  User as GithubUser,
  Repository as GithubRepository,
  Label as GithubLabel,
  Issue as GithubIssue,
  IssueComment as GithubIssueComment,
  PullRequest as GithubPullRequest,
  PushEventPayload,
  IssuesEventPayload,
  CreateEventPayload,
  Event as GithubEvent,
  EventType as GithubEventType,
  ListQuery as GithubListQuery,
} from "./types";

type GithubEventPayload = (
  | PushEventPayload
  | IssuesEventPayload
  | CreateEventPayload
);

const GithubAdapter: ApiAdapter = {
  getUser(user: GithubUser) : User {
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
    } satisfies User;
  },

  getSimpleUser(user: GithubUser): SimpleUser {
    return {
      id: user.id,
      username: user.login,
      webUrl: user.url,
      avatarUrl: user.avatar_url
    };
  },

  getSimpleRepository(repo: GithubRepository) : SimpleRepository {
    return {
      id: repo.id,
      name: repo.name,
      url: repo.url
    };
  },

  getLabel(label: GithubLabel): Label {
    return {
      id: label.id,
      name: label.name,
      description: label.description,
      color: label.color
    };
  },

  getIssue(issue: GithubIssue): Issue {
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
  },

  getIssueComment(comment: GithubIssueComment): IssueComment {
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
  },

  getMergeRequest(mergeRequest: GithubPullRequest): MergeRequest {
      return {
        id: mergeRequest.id,
        number: mergeRequest.number,
        assignee: this.getSimpleUser(mergeRequest.assignee),
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
  },

  getEventType(eventType: string) {
    let resolvedType: EventType = eventType as EventType 

    if (eventType === 'PullRequestEvent') {
      resolvedType = 'MergeRequestEvent';
    }

    return resolvedType;
  },

  getEventPayload(eventType: string, payload: GithubEventPayload): EventPayload {
    const resolvedType: GithubEventType = eventType as GithubEventType;
    const resolvedPayload: EventPayload = {
      targetType: payload.type === 'CreateEvent' ? payload.ref_type : null,
      targetName: payload.type === 'PushEvent' || payload.type === 'CreateEvent' ? payload.ref : null,
    };

    if (resolvedType === 'CreateEvent') {
      payload.type = 'CreateEvent';
    } else if (resolvedType === 'PushEvent') {
      payload.type = 'PushEvent'
    } else {
      payload.type = 'IssuesEvent';
    }

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
  },

  getEvent(event: GithubEvent): Event {
    const resolvedEvent: Event = {
      id: event.id,
      type: this.getEventType(event.type ?? ''),
      user: this.getSimpleUser(event.actor),
      repo: this.getSimpleRepository(event.repo),
      payload: this.getEventPayload(event.type ?? '', event.payload),
      createdAt: event.created_at ?? '',
    };

    return resolvedEvent;
  },

  getApiListQuery(query: ListQuery): GithubListQuery {
    return {
      page: query.page ?? 1,
      per_page: query.perPage ?? 10,
    } satisfies GithubListQuery;
  }
};

export default GithubAdapter;