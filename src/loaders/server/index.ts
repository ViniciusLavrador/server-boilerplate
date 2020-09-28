import {Application} from 'express';
import http from 'http';
import socketio from 'socket.io';

export default ({app}: {app: Application}): {socketIO: socketio.Server; httpServer: http.Server} => {

    const server = http.createServer(app);
    const io = socketio(server);

    return {
        socketIO: io,
        httpServer: server
    }
}