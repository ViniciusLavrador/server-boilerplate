import {Application} from 'express';
import {Container} from 'typedi'
//import path from 'path';
//import fs from 'fs';

import databaseConnection from './database';
import middleware from './middleware';
import routes from './routes';
import logger from './logger';
import events from './events';
import server from './server';
import apollo from './apollo';



const loggerInstance = logger().logger

export default async ({expressApp}: {expressApp: Application}): Promise<void> => {

    /**
     * Create the Database Connection
     */
    await databaseConnection();
    loggerInstance.debug("👍 Connected to Database");
    
    /**
     * Loading Express Middleware and StandAlone Routes
     */
    await middleware({app: expressApp});
    loggerInstance.debug(`👍 Loaded Express Middleware.`);

    /**
     * Loading Logger
     */
    Container.set('logger', loggerInstance);
    loggerInstance.debug(`👍 Loaded logger.`);
    
    /**
     * Loading Events
     */
    let eventEmitter = events().eventEmitter
    Container.set('eventEmitter', eventEmitter)
    loggerInstance.debug(`👍 Loaded eventEmitter.`);

    let serverConfig = server({app: expressApp});

    /**
     * Loading SocketIO
     */
    let socketIO = serverConfig.socketIO
    Container.set('socketIO', socketIO)
    loggerInstance.debug(`👍 Loaded socketIO.`);

    /**
     * Loading httpServer
     */
    let httpServer = serverConfig.httpServer
    Container.set('httpServer', httpServer)
    loggerInstance.debug(`👍 Loaded httpServer.`);

    /**
     * Loading apolloServer
     */
    let apolloServer = apollo({app: expressApp})
    loggerInstance.debug(`👍 Loaded apolloServer.`);

    /**
     * Loading Express Middleware and StandAlone Routes
     */
    await routes({app: expressApp});
    loggerInstance.debug(`👍 Loaded Stand Alone Routes.`);



    /* 
        @TODO make Dynamic Container Set Work

        //Iterate through every folder inside __dirname (except database).
        //Get every file inside them and call the default function passing the Express Application as a parameter. 
        //If the function returns an object, get the resulting object and iterate it, setting the value of each property to the container, under the property name on which it was found. 
     
    
        let directories = fs.readdirSync(__dirname).filter(dir => dir.indexOf('.ts') < 0 && dir !== 'database')
        let modules = await Promise.all(directories.map(async directory => {
            const tmp = await require(path.join(__dirname, directory)).default({app: expressApp}); 
            if (typeof tmp === "object") {
                for (var key in tmp) {
                    loggerInstance.warn(key)
                }    
            }
        }));
    
    
        await Promise.all(modules.map(async module => {
            const tmp = await require(path.join(__dirname, module)).default({app: expressApp}); 
            if (typeof tmp === "object") {
                for (var key in tmp) {
                    try{
                        let instance = Container.get(key.toString());
                        console.log(`gotit`);
                    } catch (err) {
                        console.error('error')
                    }
                }    
            }
        }));
    */

}