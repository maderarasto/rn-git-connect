import { ActivityEvent, ActivityEventType, IssueLabel, User } from '@src/types';
import {Response} from './types';

export function resolveActivityEventData(data: Response.ActivityEvent): ActivityEvent {
    const resolvedData: ActivityEvent = {
        id: data.id as number,
        type: data.type as ActivityEventType,
        author: data.actor as User,
        repo: {
            id: data.repo?.id as number,
            name: data.repo?.name as string,
        },
        payload: {
            commitCount: 0,
            commitTitle: '',
            head: data.payload?.head,
            repoId: data.payload?.repository_id
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

    return resolvedData;
}