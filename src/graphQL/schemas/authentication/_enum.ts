const Enum = `
    enum AllowedUserLookupFields {
        _id
        username
    }
`;

export const enumTypes = () => [Enum];

export const enumResolvers = {
    AllowedUserLookupFields: {
        _id: "_id",
        username: "username"
    }
};