export namespace Response {
    export type ActiveState = (
        | 'active'
        | 'inactive'
    );

    export type User = {
        id: number,
        username: string
        name: string
        state: ActiveState
        locked: boolean
        avatar_url: string
        web_url: string
        created_at?: string
        bio?: string
        location?: string
        public_email?: string
        skype?: string
        linkedin?: string
        twitter?: string
        discord?: string
        website_url?: string
        organization?: string
        job_title?: string,
        pronouns?: string
        bot?: boolean
        followers?: number
        following?: number
        work_information?: string
        local_time?: string
        last_sign_in_at?: string
        confirmed_at?: string
        last_activity_on?: string
        email?: string
        theme_id?: number
        color_scheme_id?: number
        projects_limit?: number
        current_sign_in_at?: string
        identities?: any[]
        can_create_group?: boolean
        can_create_project?: boolean
        two_factor_enabled?: boolean
        external?: boolean
        private_profile?: boolean
        commit_email?: string
        shared_runners_minutes_limit?: null
        extra_shared_runners_minutes_limit?: null
        scim_identities?: string[]
    }
}