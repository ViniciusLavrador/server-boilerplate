import { ContextWithAuthentication } from '../../../interfaces/authentication';
import { AuthenticationResolverMiddleware } from '../../middleware';

const Query = ` 
    extend type Query {
        protectedQuery: String!
    }
`;


export const queryTypes = () => [Query];

export const queryResolvers = {
    Query: {
        protectedQuery: AuthenticationResolverMiddleware.createResolver(
            (root, args: {}, context: ContextWithAuthentication, info: {}) => {
                return `you're logged in as ${context.authPayload.username}`
            }
        )
    }
}