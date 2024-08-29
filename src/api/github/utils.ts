import { ActivityEvent, ActivityEventType, IssueLabel, User } from '@src/types';
import {Response} from './types';

export function resolveActivityEventData(data: Response.ActivityEvent): ActivityEvent {
    const resolvedData: ActivityEvent = {
        id: data.id as number,
        type: data.type !== 'PullRequestEvent' ? data.type as ActivityEventType : 'MergeRequestEvent',
        author: data.actor as User,
        repo: {
            id: data.repo?.id as number,
            name: data.repo?.name as string,
        },
        payload: {
            commitCount: 0,
            commitTitle: '',
            head: data.payload?.head,
            repoId: data.payload?.repository_id,
            targetType: data.payload?.ref_type,
            targetName: data.payload?.ref
        },
        createdAt: data.created_at as string
    };

    if (data.payload?.commits ? data.payload.commits.length > 0 : false) {
        resolvedData.payload.commitCount = data.payload?.commits?.length;
        resolvedData.payload.commitTitle = data.payload?.commits?.at(0)?.message;
    }

    if (data.payload?.issue) {
        resolvedData.payload.issue = {
            id: data.payload.issue.id as number,
            number: data.payload.issue.number as number,
            title: data.payload.issue.title as string,
            body: data.payload.issue.body,
            labels: data.payload.issue.labels as IssueLabel[],
            state: data.payload.issue.state as string,
            commentCount: data.payload.issue.comments as number,
            user: data.payload.issue.user as User,
            createdAt: data.payload.issue.created_at as string,
            updatedAt: data.payload.issue.updated_at as string,
            closedAt: data.payload.issue.closed_at as string,
        }
    }

    if (data.payload?.comment) {
        resolvedData.payload.comment = {
            id: data.payload.comment.id,
            nodeId: data.payload.comment.node_id,
            body: data.payload.comment.body,
            user: data.payload.comment.user,
            url: data.payload.comment.url,
            htmlUrl: data.payload.comment.html_url,
            issueUrl: data.payload.comment.issue_url,
            createdAt: data.payload.comment.created_at,
            updatedAt: data.payload.comment.updated_at
        }
    }

    if (data.payload?.pull_request) {
        resolvedData.payload.mergeRequest = {
            id: data.payload.pull_request.id as number,
            nodeId: data.payload.pull_request.node_id as string,
            number: data.payload.pull_request.number as number,
            asignee: data.payload.pull_request.assignee as User,
            asignees: data.payload.pull_request.assignees as User[],
            autoMerge: data.payload.pull_request.auto_merge as boolean,
            body: data.payload.pull_request.body,
            changedFiles: data.payload.pull_request.changed_files as number,
            commentCount: data.payload.pull_request.comments as number,
            commentsUrl: data.payload.pull_request.comments_url as string,
            commitCount: data.payload.pull_request.commits as number,
            commitsUrl: data.payload.pull_request.commits_url as string,
            deletions: data.payload.pull_request.deletions as number,
            draft: data.payload.pull_request.draft as boolean,
            diffUrl: data.payload.pull_request.diff_url as string,
            issueUrl: data.payload.pull_request.issue_url as string,
            labels: data.payload.pull_request.labels as IssueLabel[],
            locked: data.payload.pull_request.locked as boolean,
            merged: data.payload.pull_request.merged as boolean,
            mergedAt: data.payload.pull_request.merged_at as string,
            mergedBy: data.payload.pull_request.merged_by,
            rebaseable: data.payload.pull_request.rebaseable as boolean,
            requestedReviewers: data.payload.pull_request.requested_reviewers as User[],
            requestedTeams: data.payload.pull_request.requested_teams as any[],
            reviewCommentUrl: data.payload.pull_request.review_comment_url as string,
            reviewCommentCount: data.payload.pull_request.review_comments as number,
            reviewCommentsUrl: data.payload.pull_request.review_comments_url as string,
            state: data.payload.pull_request.state as string,
            title: data.payload.pull_request.title as string,
            user: data.payload.pull_request.user as User,
            createdAt: data.payload.pull_request.created_at as string,
            updatedAt: data.payload.pull_request.updated_at,
            closedAt: data.payload.pull_request.closed_at,
        }
    }

    return resolvedData;
}