import express from 'express';
import {User, UserRepository} from '../../database/models/User'
import {Logger} from 'winston';
import {createAccessToken, createRefreshToken, verifyRefreshToken} from '../../services/utilities/tokens';
import {Container} from 'typedi';
import AuthenticationService from '../../services/authentication';
import UtilitiesService from '../../services/utilities';





export default ({app}: {app: express.Application}) => {

    const loggerInstance = Container.get('logger') as Logger;
    const authInstance = Container.get(AuthenticationService);
    const utilitiesInstance = Container.get(UtilitiesService)
    const userRepository = Container.get(UserRepository);

// Base Server Status StandAlone Routes
    app.get('/status', (_, res) => res.status(200).end(`We're Up & Running`));
    app.head('/status', (_, res) => res.status(200).end(`We're Up & Running`));

    // Refresh Session StandAlone Route
    app.post('/refresh-session', async (req: express.Request, res: express.Response) => {

        const refreshToken: string = req.cookies.rtid

        let payload: any = null;

        try {
            payload = verifyRefreshToken(refreshToken)
        } catch (err) {
            loggerInstance.error(`Invalid Refresh Token. ${err}`)
            return res.json({
                status: 'FAILED'
            }).status(401).end()
        }

        let user = await User.findOne({username: payload.username}, {})
        
        if (!user) {
            loggerInstance.error('Could not refresh session. Did not reckognize user.')
            return res.json({
                status: 'FAILED'
            }).status(401).end()
        }

        if (payload.tokenVersion !== user.tokenVersion) {
            loggerInstance.error('Could not refresh session. Invalidated Session.')
            return res.json({
                status: 'FAILED'
            }).status(401).end()
        }

        res.cookie('rtid', createRefreshToken(user));

        return res.status(200).send({status: 'LOGGEDIN', access_token: createAccessToken(user)});
    
    });

    // Logout Session StandAlone Route
    app.post('/logout', async (req: express.Request, res: express.Response) => {
      
        // Get RefreshToken
        const refreshToken: string = req.cookies.rtid
        
        let payload: any = null;

        try {
            payload = verifyRefreshToken(refreshToken)
        } catch (err) {
            loggerInstance.error(`Invalid Refresh Token. ${err}`)
            return res.json({
                status: 'FAILED'
            }).status(401).end()
        }

        let user = await User.findOne({username: payload.username}, {})
        
        if (!user) {
            loggerInstance.error('Could not log out. Did not reckognize user.')
            return res.json({
                status: 'FAILED'
            }).status(401).end()
        }

        if (payload.tokenVersion !== user.tokenVersion) {
            loggerInstance.warn('Could not log out. Invalidated Session. User is probably already logged out.')
            return res.json({
                status: 'FAILED'
            }).status(401).end()
        }

        if (await user.invalidateToken()) {
            return res.status(200).send({status: 'LOGGEDOUT'});
        } 

        return res.json({
            status: 'FAILED'
        }).status(401).end()

    })

    // LogIn Session StandAlone Route
    app.post('/login', async (req: express.Request, res: express.Response) => {

        loggerInstance.silly('Got LogIn Request');
            
        // Fetch User from Database and Authenticate
        let {username, password} = req.body
        let extendedUser = await authInstance.logIn(username, password);
        
        // Deestructure user from generated tokens
        let {refreshToken} = extendedUser;

        // set refreshToken to cookies
        res.cookie('rtid', refreshToken, {httpOnly: true});

        return res.status(200).send({
            accessToken: extendedUser.accessToken,
            user: {
                username: extendedUser.user.username,
                email: extendedUser.user.email,
                firstName: extendedUser.user.firstName, 
                lastName: extendedUser.user.lastName
            }
        });

    });


}