const Repository = {
    landing: 'https://github.com/O4bit/website',
    get issues() {
        return `${this.landing}/issues`
    },
} as const

export const RepositoryLinks = Repository

export { Repository }
