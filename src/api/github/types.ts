export namespace Response {
    export type User = Partial<{
        login: string
        display_login: string
        id: number
        node_id: string
        avatar_url: string
        gravatar_id: string
        url: string
        html_url: string
        followers_url: string
        following_url: string
        gists_url: string
        starred_url: string
        subscriptions_url: string
        organizations_url: string
        repos_url: string
        events_url: string
        received_events_url: string
        type: string
        site_admin: boolean
        name: string
        company: string
        blog: string
        location: string
        email: string
        hireable: null
        bio?: string
        twitter_username: string
        public_repos: number
        public_gists: number
        followers: number
        following: number
        created_at: string
        updated_at: string
    }>;

    export type Repository = Partial<{
        id: number
        node_id: string
        name: string
        full_name: string
        private: boolean
        owner: User,
        html_url: string
        description: string
        fork: false
        url: string
        forks_url: string
        keys_url: string
        collaborators_url: string
        teams_url: string
        hooks_url: string
        issue_events_url: string
        events_url: string
        assignees_url: string
        branches_url: string
        tags_url: string
        blobs_url: string
        git_tags_url: string
        git_refs_url: string
        trees_url: string
        statuses_url: string
        languages_url: string
        stargazers_url: string
        contributors_url: string
        subscribers_url: string
        subscription_url: string
        commits_url: string
        git_commits_url: string
        comments_url: string
        issue_comment_url: string
        contents_url: string
        compare_url: string
        merges_url: string
        archive_url: string
        downloads_url: string
        issues_url: string
        pulls_url: string
        milestones_url: string
        notifications_url: string
        labels_url: string
        releases_url: string
        deployments_url: string
        created_at: string
        updated_at: string
        pushed_at: string
        git_url: string
        ssh_url: string
        clone_url: string
        svn_url: string
        homepage: string
        size: number
        stargazers_count: number
        watchers_count: number
        language: string
        has_issues: boolean
        has_projects: boolean
        has_downloads: boolean
        has_wiki: boolean
        has_pages: boolean
        has_discussions: boolean
        forks_count: number
        mirror_url: string
        archived: boolean
        disabled: boolean
        open_issues_count: number
        license: string
        allow_forking: boolean
        is_template: boolean
        web_commit_singoff_required: boolean
        topics: string[]
        visibility: string
        forks: number
        open_issues: number
        watchers: number
        default_branch: string
        permissions: {
            admin: boolean
            maintain: boolean
            triage: boolean
            pull: boolean
        }
    }>;

    export type SearchRepositories = Partial<{
        incomplete_results: boolean
        total_count: number
        items: Repository[]
    }>;

    export type Commit = Partial<{
        sha: string
        author: User
        message: string
        distinct: boolean
        url: string
    }>;

    export type IssueLabel = {
        color: string
        default: boolean
        description: string
        id: number
        name: string
        node_id: string
        url: string
    };

    export type IssueReactions = {
        '+1': number
        '-1': number
        confused: number
        eyes: number
        heart: number
        hooray: number
        laugh: number
        rocket: number
        total_count: number
        url: string
    }

    export type IssueComment = {
        id: number
        node_id: string
        body?: string
        reactions: IssueReactions
        user: User
        url: string
        html_url: string
        issue_url: string
        created_at: string
        updated_at: string
    }

    export type Issue = Partial<{
        assignee: User
        assignees: User[]
        author_association: string
        body: string
        closed_at: string
        comments: number
        comments_url: string
        created_at: string
        events_url: string
        html_url: string
        id: number
        labels: IssueLabel[]
        labels_url: string
        locked: boolean
        milestone: any
        node_id: string
        number: number
        reactions: IssueReactions
        repository_url: string
        state: string
        state_reason: string
        timeline_url: string
        title: string
        updated_at: string
        url: string
        user: User
    }>;

    export type ActivityPayload = Partial<{
        repository_id: number
        push_id: number
        size: number
        distinct_size: number
        ref: string
        head: string
        before: string
        commits: Commit[]
        issue: Issue
        comment: IssueComment
    }>;

    export type ActivityEvent = Partial<{
        id: number
        type: string
        actor: User
        repo: Repository
        payload: ActivityPayload
        public: boolean
        created_at: string
    }>;
}

export namespace QueryParams {
    export type UserRepositories = Partial<{
        type: 'all' | 'owner' | 'member'
        sort: 'created' | 'updated' | 'pushed' | 'full_name'
        direction: 'asc' | 'desc'
        per_page: number
        page: number
    }>

    export type SearchRepositories = Partial<{
        q: string
        per_page: number
        page: number
        sort: 'best-match' | 'stars' | 'forks' | 'help-wanted-issues' | 'updated'
        order: 'asc' | 'desc'
    }>

    export type ActivityEvents = Partial<{
        per_page: number
        page: number
    }>
}