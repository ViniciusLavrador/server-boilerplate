import { sign, verify } from "jsonwebtoken";
import config from '../../config'
import { User } from "../../database/models/User";

const REFRESH_TOKEN = {
    secret: config.api.authentication.tokens.refreshToken.secret,
    duration: config.api.authentication.tokens.refreshToken.duration
}

const ACCESS_TOKEN = {
    secret: config.api.authentication.tokens.accessToken.secret,
    duration: config.api.authentication.tokens.accessToken.duration
}

export const createRefreshToken = (user: User) => {
    return sign({ username: user.username, tokenVersion: user.tokenVersion }, REFRESH_TOKEN.secret, { expiresIn: REFRESH_TOKEN.duration });
}

export const createAccessToken = (user: User) => {
    return sign({ username: user.username }, ACCESS_TOKEN.secret, { expiresIn: ACCESS_TOKEN.duration });
}

export const verifyRefreshToken = (token: string) => {
    return verify(token, REFRESH_TOKEN.secret);
}

export const verifyAccessToken = (token: string) => {
    return verify(token, ACCESS_TOKEN.secret);
}