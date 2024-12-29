import {
  SimpleUser, User, Repository, SimpleRepository,
  ListParams, Event, EventType, EventPayload, SearchReposParams, RepositoryListParams
} from '@src/api/types';
import {
  User as GitlabUser,
  SimpleUser as GitlabSimpleUser,
  Project as GitlabProject,
  SimpleProject as GitlabSimpleProject,
  Event as GitlabEvent,
  ListParams as GitlabListParams,
  ProjectListPrams as GitlabProjectListParams,
  SearchProjectParams as GitlabSearchProjectParams,
} from '@src/api/gitlab/types';

function resolveEventType(actionName: string, targetType: string, pushAction: string): EventType {
  let type: EventType = 'CreateEvent';

  if (actionName === 'pushed to' && pushAction === 'pushed') {
    type = 'PushEvent';
  } else if (actionName === 'pushed new' && pushAction === 'created') {
    type = 'CreateEvent';
  } else if (actionName === 'updated') {
    type = 'UpdateEvent';
  } else if (actionName === 'commented on') {
    type = 'IssueCommentEvent'
  } else if (targetType === 'MergeRequest') {
    type = 'MergeRequestEvent';
  } else if (targetType === 'Issue') {
    type = 'IssuesEvent';
  } else if (targetType === 'Milestone') {
    type = 'MilestoneEvent';
  }

  return type;
}

function resolveEventPayload(event: GitlabEvent): EventPayload {
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

  if (event.target_type === 'Milestone') {
    resolvedPayload.milestone = {
      id: event.target_iid as number,
      title: event.target_title as string,
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

  if (event.action_name === 'commented on' && event.note) {
    resolvedPayload.comment = {
      id: event.target_id as number,
      body: event.note.body,
      user: deserializeSimpleUser(event.note.author),
      createdAt: new Date(event.note.created_at),
      updatedAt: new Date(event.note.updated_at),
    };

    resolvedPayload.issue = {
      id: event.note.noteable_id,
      title: event.target_title as string,
      number: event.note.noteable_iid,
    }
  }

  if (event.wiki_page) {
    resolvedPayload.wiki = {
      format: event.wiki_page.format,
      slug: event.wiki_page.slug,
      title: event.wiki_page.title
    }
  }

  return resolvedPayload;
}

export function deserializeUser(user: GitlabUser): User {
  return {
    id: user.id,
    service: 'Gitlab',
    username: user.username,
    name: user.name,
    avatarUrl: user.avatar_url,
    url: user.web_url,
    blog: user.website_url,
    company: user.organization,
    location: user.location,
    email: user.email ?? null,
    bio: user.bio,
    followers: user.followers,
    following: user.following,
    createdAt: new Date(user.created_at),
  };
}

export function deserializeSimpleUser(
  user: GitlabSimpleUser | GitlabUser
): SimpleUser {

  return {
    id: user.id,
    username: user.username,
    url: user.web_url,
    avatarUrl: user.avatar_url
  };
}

export function deserializeRepository(repository: GitlabProject): Repository {
  return {
    id: repository.id,
    name: repository.name,
    fullName: repository.name_with_namespace,
    path: repository.path,
    fullPath: repository.path_with_namespace,
    description: repository.description,
    topics: repository.topics,
    language: null,
    owner: repository.owner ? deserializeSimpleUser(repository.owner): null,
    visibility: repository.visibility,
    forks: repository.forks_count,
    openIssues: repository.open_issues_count,
    watchers: repository.star_count,
    defaultBranch: repository.default_branch,
    url: repository.web_url,
    avatarUrl: repository.avatar_url,
    hasIssues: repository.issues_enabled,
    hasWiki: repository.wiki_enabled,
    createdAt: new Date(repository.created_at),
    updatedAt: new Date(repository.updated_at)
  };
}

export function deserializeSimpleRepository(
  repository: GitlabSimpleProject | GitlabProject
): SimpleRepository {
  return {
    id: repository.id,
    name: repository.name,
    url: repository.web_url
  };
}

export function deserializeEvent(event: GitlabEvent): Event {
  return {
    id: event.id,
    type: resolveEventType(
      event.action_name,
      event.target_type ?? '',
      event.push_data?.action ?? ''),
    user: deserializeSimpleUser(event.author),
    repo: { id: event.project_id, name: '', url: '', },
    payload: resolveEventPayload(event),
    createdAt: new Date(event.created_at),
  }
}

export function serializeListParams(params: ListParams): GitlabListParams {
  return {
    page: params.page ?? 1,
    per_page: params.perPage ?? 10,
  };
}

export function serializeRepositoryListParams(params: RepositoryListParams): GitlabProjectListParams {
  return {
    ...serializeListParams(params),
    owned: params.owned ?? false,
    membership: params.membership ?? false,
  }
}

export function serializeSearchProjectsParams(params: SearchReposParams): GitlabSearchProjectParams {
  return {
    ...serializeRepositoryListParams(params),
    search: params.searchText,
    with_programming_language: params.language?.toLowerCase(),
  }
}