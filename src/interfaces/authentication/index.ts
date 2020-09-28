import { Request, Response } from 'express';
import {User} from '../../database/models/User';

export interface ExtendedUser {
    accessToken: string;
    refreshToken: string;
    user: User;
} 

export interface ContextWithAuthentication {
    req: Request;
    res: Response;
    authPayload?: {username: string};
}