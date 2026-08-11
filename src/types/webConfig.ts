export interface Theme {
    name: string
    default?: boolean;
    id: string
    color: string
}

export interface MenuLink {
    name: string
    icon?: string
    url: string
}

export interface SeerrConfig {
    enabled?: boolean
    name?: string
    url?: string
}

export interface WebConfig {
    includeCorsCredentials?: boolean
    multiserver?: boolean
    themes?: Theme[]
    menuLinks?: MenuLink[]
    seerr?: SeerrConfig
    servers?: string[]
    plugins?: string[]
}
