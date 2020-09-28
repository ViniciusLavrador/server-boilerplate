import 'reflect-metadata';
import express from 'express';
import {Container} from 'typedi'
import logger from './loaders/logger'
import {Server} from 'http'
import config from './config';
import loader from './loaders';
/**
 * Start Server Application
 */
async function startServer():Promise<void> {
    
    const loggerInstance = logger().logger;
    
    try {
        loggerInstance.info("⛽ Server is Fueling Up...")

        const app = express();
        await loader({expressApp: app});
        
        const server = Container.get<Server>('httpServer');

        server.listen(config.server.port, config.server.hostname, () => {
            loggerInstance.info(`🚀 Server Launched. Energize !`);
            loggerInstance.silly(`We're Online @ http://${config.server.hostname}:${config.server.port}${config.api.path}`)
        });
    } catch (err) {
        loggerInstance.error(err.message);
        loggerInstance.debug(err.stack);
        loggerInstance.info('💀💥 Server has Crashed.');
        process.exit(1);
    }
}

startServer();