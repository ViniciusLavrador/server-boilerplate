import {ApolloError, AuthenticationError, ForbiddenError, UserInputError, ValidationError} from 'apollo-server-express';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';

// Error Service
@Service()
export default class ErrorService {

    constructor(
        @Inject('logger') private logger: Logger,
    ){}

    private throwApolloError(baseError: ApolloError) {
        
        this.logger.error(`${baseError.name} - ${baseError.message}`);
        this.logger.debug(baseError.stack);

       throw baseError;
    }
    
    public AuthenticationError(message?: string, stack?: string) {
        let authErr = new AuthenticationError(message || 'Authentication failed. Please check your credentials.');
        if(stack) authErr.stack = stack;
        return this.throwApolloError(authErr);       
    }

    public AuthenticationRequiredError(message?: string) {
        return this.throwApolloError(new AuthenticationError(message || 'You must be logged in to do this.'));       
    }
    
    public ValidationError(message?: string) {
        return this.throwApolloError(new ValidationError(message || 'Invalid Data ! Please check your mutation and try again.'));       
    }

    public UserInputError(message?: string) {
        return this.throwApolloError(new UserInputError(message || 'Invalid Input ! Please check your mutation and try again.'));       
    }

    public ForbiddenError(message?: string) {
        return this.throwApolloError(new ForbiddenError(message || 'You are not allowed to do this.'));       
    }

    public DoesNotExist(message?: string) {
        return this.throwApolloError(new ApolloError(message || 'The resource does not exist.', 'DOESNOTEXIST'));
    }

    public rawUnknownError() {
        return new ApolloError('An unknown error has occurred ! Please try again.', 'UNKNOWNERROR');
    }

    public UnknownError() {
        return this.throwApolloError(this.rawUnknownError())
    }

}