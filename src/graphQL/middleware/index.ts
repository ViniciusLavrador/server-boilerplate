import {createResolver as createApolloResolver} from 'apollo-resolvers';
import {Container} from 'typedi';
import ErrorService from '../../services/error';
import UtilitiesService from '../../services/utilities';

import { ApolloError, AuthenticationError, ForbiddenError, UserInputError, ValidationError } from 'apollo-server-express';
import { ContextWithAuthentication } from '../../interfaces/authentication';


const errorGenerator = Container.get(ErrorService);
const utilitiesInstance = Container.get(UtilitiesService);

// Base Resolver
export const BaseResolverMiddleware = createApolloResolver(
    // No-op Base Resolver 
    null, 
    // Mask Any Non-Apollo Error
    (_, __, ___, error) =>  error instanceof ApolloError || error instanceof AuthenticationError || error instanceof  ValidationError || 
                            error instanceof UserInputError || error instanceof ForbiddenError ?
                            error : errorGenerator.rawUnknownError()
)

export const AuthenticationResolverMiddleware = BaseResolverMiddleware.createResolver(
    async (root: any, args: {}, context: ContextWithAuthentication, info: {}) => {
        const authorizationHeader = context.req.headers['authorization']
        
        if (!authorizationHeader) errorGenerator.AuthenticationError()

        try {
            const accessToken = authorizationHeader.split(' ')[1];
            const payload = await utilitiesInstance.verifyToken('accessToken', accessToken);
            context.authPayload = payload as any;
        } catch (err) {
            errorGenerator.AuthenticationError(undefined, err.stack);
        }
    }
)