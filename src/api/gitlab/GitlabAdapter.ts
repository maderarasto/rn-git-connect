import ApiAdapter from "../ApiAdapter";
import { 
  User, 
  Event,
  ListQuery, 
  EventType,
  SimpleUser,
  EventPayload,
  SimpleMergeRequest,
  Label,
  SimpleIssue,
  SimpleRepository
} from "../types";
import { 
  User as GitlabUser,
  SimpleUser as GitlabSimpleUser,
  Event as GitlabEvent,
  ListQuery as GitlabListQuery,
  MergeRequest as GitlabMergeRequest,
} from "./types";

export default class GitlabAdapter implements ApiAdapter {
  getUser(user: GitlabUser): User {
    return {
      id: user.id,
      service: 'Gitlab',
      username: user.username,
      fullname: user.name,
      avatarUrl: user.avatar_url,
      webUrl: user.web_url,
      company: user.organization,
      location: user.location ?? '',
      email: user.email ?? '',
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      createdAt: user.created_at
    }
  }

  getSimpleUser(user: GitlabUser|GitlabSimpleUser): SimpleUser {
    return {
      id: user.id,
      username: user.username,
      webUrl: user.web_url,
      avatarUrl: user.avatar_url,
    };
  }

  getSimpleRepository(repository: any): SimpleRepository {
    throw new Error("Method not implemented.");
  }
  
  getSimpleIssue(issue: any): SimpleIssue {
    throw new Error("Method not implemented.");
  }

  getSimpleMergeRequest(mergeRequest: any): SimpleMergeRequest {
    throw new Error("Method not implemented.");
  }

  getLabel(label: any): Label {
    throw new Error("Method not implemented.");
  }

  getEvent(event: GitlabEvent): Event {
    return {
      id: event.id,
      type: this.resolveEventType(event.action_name, event.push_data?.action ?? ''),
      user: this.getSimpleUser(event.author),
      repo: {
        id: event.project_id,
        name: '',
        url: ''
      },
      payload: this.resolveEventPayload(event),
      createdAt: event.created_at,
    }
  }
  getApiListQuery(params: ListQuery): GitlabListQuery {
    return {
      page: params.page,
      per_page: params.perPage,
    }
  }

  // protected
  resolveEventType(actionName: string, pushAction: string): EventType {
    let type: EventType = 'CreateEvent';

    if (actionName === 'pushed to' && pushAction === 'pushed') {
        type = 'PushEvent';
    } else if (actionName === 'pushed new' && pushAction === 'created') {
        type = 'CreateEvent';
    } else if (actionName === 'commented on') {
        type = 'IssueCommentEvent'
    } else if (actionName === 'MergeRequest') {
        type = 'MergeRequestEvent';
    } else if (actionName === 'Issue') {
        type = 'IssuesEvent';
    }

    return type;
  }

  resolveEventPayload(event: GitlabEvent): EventPayload {
    const resolvedPayload: EventPayload = {};

    if (event.action_name === 'created') {
      resolvedPayload.targetType = 'repository';
    }

    if (event.push_data) {
      resolvedPayload.targetName = event.push_data.ref;
      resolvedPayload.targetType = event.push_data.ref_type;
      resolvedPayload.push = {
        repoId: event.project_id,
        head: event.push_data.commit_to ?? '',
        commitTitle: event.push_data.commit_title,
        commitCount: event.push_data.commit_count,
      };
    }

    if (event.target_type === 'Issue') {
      resolvedPayload.issue = {
        id: event.target_id as number,
        title: event.target_title as string,
        number: event.target_iid as number,
        state: event.action_name,
      };
    }

    if (event.target_type === 'MergeRequest') {
      resolvedPayload.mergeRequest = {
        id: event.target_id as number,
        title: event.target_title as string,
        number: event.target_iid as number,
        state: event.action_name,
      }
    }

    if (event.action_name === 'commented_on' && event.note) {
      resolvedPayload.comment = {
        id: event.target_id as number,
        body: event.note.body,
        user: this.getSimpleUser(event.note.author),
        createdAt: event.note.created_at,
        updatedAt: event.note.updated_at,
      };

      resolvedPayload.issue = {
        id: event.note.noteable_id,
        title: event.target_title as string,
        number: event.note.noteable_iid,
      }
    }

    return resolvedPayload;
  }
};