const Input = `
    input registerInput {
        username: String!
        password: String!
        email: String
        firstName: String
        lastName: String
    }

    input SignInInput {
        username: String!
        password: String!
    }
`;

export default () => [Input];