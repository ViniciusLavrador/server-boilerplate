import { Container } from 'typedi';
import AuthenticationService from '../../../services/authentication';

const authInstance = Container.get(AuthenticationService);

const Query = `    
`;


export const queryTypes = () => [Query];

export const queryResolvers = {
}