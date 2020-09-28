
import {Inject, Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { User, UserRepository } from '../../database/models/User';
import {compare} from 'bcrypt'
import ErrorService from '../error';
import {ExtendedUser} from '../../interfaces/authentication';
import UtilitiesService from '../utilities';



@Service()
export default class AuthenticationService {

    constructor(
        @InjectRepository()
        private readonly userRepository: UserRepository,
        private readonly errorGenerator: ErrorService,
        private readonly utilities: UtilitiesService,
        @Inject('logger') private logger: Logger,
    ) {}

    /**
     * Register a New User
     * @param {string} username - Must be an unique username
     * @param {string} rawPassword
     * @param {string} [email]
     * @param {string} [firstName]
     * @param {string} [lastName]
     * @return {Promise<User>}
     * @memberof AuthenticationService
     */
    public async registerUser(username: string, rawPassword: string, email?: string, firstName?: string, lastName?: string): Promise<User> {
        this.logger.debug('registerUser method of AuthenticationService called');
        let user = await this.userRepository.createUser(username, rawPassword, email, firstName, lastName);
        return user;
    }


    /**
     * LogIn an User
     * @param {string} username
     * @param {string} rawPassword
     * @return {Promise<ExtendedUser>}
     * @memberof AuthenticationService
     */
    public async logIn(username: string, rawPassword: string): Promise<ExtendedUser> {
        this.logger.debug('logIn method of Authentication Service called');
        let user = await this.userRepository.fetchByUsername(username);
        let match = await compare(rawPassword, user.password);
        if (!match) this.errorGenerator.AuthenticationError(); 
        
        let extendedUser: ExtendedUser = {
            refreshToken: await this.utilities.generateToken('refreshToken', user),
            accessToken: await this.utilities.generateToken('accessToken', user),
            user: user
        }

        return extendedUser;
    }
    
}
