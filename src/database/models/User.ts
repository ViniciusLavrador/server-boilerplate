import { Inject, Service } from 'typedi';
import {
    BaseEntity,
    Entity,
    Column,
    PrimaryGeneratedColumn, 
    EntityRepository, 
    Repository, BeforeInsert, BeforeUpdate, AfterLoad,
    In 
} from 'typeorm';
import config from '../../config';
import {hash} from 'bcrypt'
import logger from '../../loaders/logger'
import ErrorService from '../../services/error';
import { Logger } from 'winston';

@Entity()
export class User extends BaseEntity{
    
    @PrimaryGeneratedColumn('uuid')
    id: number;
    
    @Column({
        length: 25,
        unique: true,
    })
    username: string;
    
    @Column()
    password: string;

    @Column({
        nullable: true,
        unique: true
    })
    email: string;

    @Column({
        length: 150, 
        nullable: true
    })
    firstName: string;

    @Column({
        length: 150,
        nullable: true
    })
    lastName: string;

    @Column({type: 'int', default: 0})
    tokenVersion: number

    // String Representation
    public toString(): string {
        return `<User: ${this.username}>`
    }

    // increase tokenVersion
    public async invalidateToken(): Promise<boolean> {
        try {
            this.tokenVersion = this.tokenVersion + 1 
            await this.save()
            return true   
        } catch (err){
            return false
        }
    }

    // Entity Listeners
    private tmpPassword: string;

    @AfterLoad()
    private loadTmpPassword(): void {
        this.tmpPassword = this.password;
    }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.tmpPassword !== this.password) {
            this.password = await hash(this.password, config.api.authentication.saltRounds)
        }
    }

}

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    
    private readonly logger: Logger = logger().logger;
    private readonly errorGenerator = new ErrorService(this.logger);

    /**
     * @param {string} username
     * @param {string} password
     * @param {string} [email]
     * @param {string} [firstName]
     * @param {string} [lastName]
     * @return {Promise<User>}
     * @memberof UserRepository
     */
    public async createUser(username: string, password: string, email?: string, firstName?: string, lastName?: string): Promise<User> {
        this.logger.debug('createUser method of UserRepository called')
        try {
            let user = this.create({username, password, email, firstName, lastName});
            await user.save();
            return user;
        } catch(err) {
            if (this.exists(username)) {
                this.errorGenerator.ValidationError('Username Taken');
            } else {
                this.logger.error(err);
                this.logger.debug(err.stack);
            }
        }
    }

    /**
     * Check if User Exists
     * @param {string} username 
     */
    public async exists(username: string): Promise<Boolean> {
        let count = await this.count({username: username});
        if (count === 0) {
            return false
        } else {
            return true
        }
    }

    /**
     * Fetch a User by its username
     * @param {string} username - The User's username
     * @returns {Promise<User>}
     */
    public async fetchByUsername(username: string): Promise<User> {
        this.logger.debug('fetchByUsername method of UserRepository called');
        let user = await this.findOne({username}, {});
        if (!user) this.errorGenerator.DoesNotExist('User Does Not Exist');
        this.logger.debug(`Fetched User: ${user}`);
        return user;
    }

    /**
     * Fetch Users by a list of usernames
     * @param {string[]} usernames - a List of usernames
     * @returns {Promise<User[]>}
     */
    public async fetchByUsernames(usernames: string[]): Promise<User[]> {
        this.logger.debug('fetchByUsernames method of UserRepository called')
        let users = await this.find(usernames && {where: {
            username: In(usernames)
        }});
        this.logger.debug(`Fetched Users: ${users}`);
        return users;
    }

    /**
     * Update a User
     * @param {User} user
     * @param {string} [username]
     * @param {string} [password]
     * @param {string} [email]
     * @param {string} [firstName]
     * @param {string} [lastName]
     * @return {Promise<User>}
     * @memberof UserRepository
     */
    public async updateUser(user: User, username?: string, password?: string, email?: string, firstName?: string, lastName?: string): Promise<User> {
        this.logger.debug('updateUser method of UserRepository called')
        
        if (username) user.username = username;
        if (password) user.password = password;
        if (email) user.email = email;
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;

        this.logger.debug(`updated ${username ? '|username|' : ''} ${password ? '|password|' : ''} ${email ? '|email|' : ''} ${firstName ? '|firstName|' : ''}${lastName ? '|lastName|' : ''}`)

        await user.save();

        return user;
    }




}