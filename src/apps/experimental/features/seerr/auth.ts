type SeerrAuthClient = {
    accessToken: () => string | null | undefined;
};

export const selectSeerrAuthToken = (
    ...clients: Array<SeerrAuthClient | null | undefined>
) => {
    for (const client of clients) {
        const token = client?.accessToken()?.trim();
        if (token) return token;
    }

    return undefined;
};
