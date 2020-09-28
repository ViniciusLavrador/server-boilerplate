import {Container} from 'typedi';
import {Logger} from 'winston';
import AuthenticationService from '../../../services/authentication';
import { User } from '../../../database/models/User';

const authInstance = Container.get(AuthenticationService);
const logger = Container.get<Logger>('logger')

const Mutation = `
    extend type Mutation {
        register(input: registerInput!): User!
    }
`;

export const mutationTypes = () => [Mutation]
export const mutationResolvers = {
    Mutation: {
        register: async (_: unknown, { input }): Promise<User> => {
            logger.silly('Got Register Request');
            let {username, password, email, firstName, lastName} = input
            let user = await authInstance.registerUser(username, password, email, firstName, lastName);
            return user;
        },
    }
};