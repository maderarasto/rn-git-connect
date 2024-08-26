import { ActivityEvent, ActivityEventType, User } from '@src/types';
import {Response} from './types';

export function resolveActivityEventData(data: Response.ActivityEvent): ActivityEvent {
    const resolvedData: ActivityEvent = {
        id: data.id as number,
        type: data.type as ActivityEventType,
        author: data.actor as User,
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

    return resolvedData;
}