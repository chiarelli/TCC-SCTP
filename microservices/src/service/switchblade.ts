const LIMIT_MAX = process.env.LIMIT_MAX;

export const ListingParams = {
    limit: `number|convert|integer|min:0|max:${LIMIT_MAX}|default:20`,
    offset: "number|convert|integer|min:0|default:0"
}

export const UserParams = {
    name: 'string|optional',
    email: 'email|optional',
}