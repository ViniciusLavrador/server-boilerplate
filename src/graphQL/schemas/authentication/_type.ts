const User = `

    type ExtendedUser {
        accessToken: String!
        user: User!
    }

    type User {
        _id: ID!
        username: String!
        email: String
        firstName: String
        lastName: String
    }

`;

export const types = () => [User];

export const typeResolvers = {
};