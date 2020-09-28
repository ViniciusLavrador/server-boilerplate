import {createConnection, useContainer} from 'typeorm';
import {Container} from 'typedi';
import logger from '../logger';

const loggerInstance = logger().logger;

export default async () => {
    
    useContainer(Container);

    let connection = await createConnection()
    loggerInstance.silly(`Database Connection Metadata: ${JSON.stringify({...connection.options, password: '*****'})}` );
}