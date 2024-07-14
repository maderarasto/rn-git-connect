export namespace Response {
    export type ActiveState = (
        | 'active'
        | 'inactive'
    );

    export type User = Partial<{
        id: number,
        username: string
        name: string
        state: ActiveState
        locked: boolean
        avatar_url: string
        web_url: string
        created_at: string
        bio: string
        location: string
        public_email: string
        skype: string
        linkedin: string
        twitter: string
        discord: string
        website_url: string
        organization: string
        job_title: string,
        pronouns: string
        bot: boolean
        followers: number
        following: number
        work_information: string
        local_time: string
        last_sign_in_at: string
        confirmed_at: string
        last_activity_on: string
        email: string
        theme_id: number
        color_scheme_id: number
        projects_limit: number
        current_sign_in_at: string
        identities: any[]
        can_create_group: boolean
        can_create_project: boolean
        two_factor_enabled: boolean
        external?: boolean
        private_profile: boolean
        commit_email: string
        shared_runners_minutes_limit: null
        extra_shared_runners_minutes_limit: null
        scim_identities: string[]
    }>;

    export type Project = Partial<{
        id: number
        description: string
        name: string
        name_with_namespace: string
        path: string
        path_with_namespace: string
        created_at: string
        default_branch: string
        tag_list: string[]
        topics: string[]
        ssh_url_to_repo: string
        http_url_to_repo: string
        web_url: string
        readme_url: string
        forks_count: number
        avatar_url: string
        star_count: number
        last_activity_at: string
        namespace: {
            id: number
            name: string
            path: string
            kind: string
            full_path: string
            parent_id: number
            avatar_url: string
            web_url: string
        }
        _links: {
            self: string
            issues: string
            merge_requests: string
            repo_branches: string
            labels: string
            events: string
            members: string
            cluster_agents: string
        }
        packages_enabled: boolean
        empty_repo: boolean
        archived: boolean
        visibility: string
        owner: User
        issues_enabled: boolean
        merge_requests_enabled: boolean
        wiki_enabled: boolean
        jobs_enabled: boolean
        snippets_enabled: true
        can_create_merge_request_in: boolean
        creator_id: number
        updated_at: string
    }>
}

export namespace QueryParams {
    export type OrderBy = (
        | 'id'
        | 'name'
        | 'path'
        | 'created_at'
        | 'updated_at'
        | 'last_activity_at'
        | 'similarity'
    );

    export type SortDirection = (
        | 'asc'
        | 'desc'
    )

    export type Projects = Partial<{
        search: string
        with_programming_language: string
        membership: boolean
        owned: boolean
        order_by: OrderBy
        sort: SortDirection
        per_page: number
        page: number
    }>
}