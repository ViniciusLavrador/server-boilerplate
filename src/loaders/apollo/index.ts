import {Application} from 'express'
import {ApolloServer} from 'apollo-server-express';
import logger from '../logger';
import config from '../../config'
import { ContextWithAuthentication } from '../../interfaces/authentication';

const loggerInstance = logger().logger



export default ({app}:{app: Application}) => {

    const apollo = new ApolloServer({
        schema: require('../../graphQL/schemas').default,
        debug: process.env.NODE_ENV === 'development',
        logger: loggerInstance,
        engine: {
            reportSchema: true
        },
        // @TODO validate incoming token and refresh
        context: ({req, res}: ContextWithAuthentication) => ({req, res})
    });

    apollo.applyMiddleware({
        app: app,
        path: config.api.path
    });
}