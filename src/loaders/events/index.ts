import eventListeners from '../../subscribers'
import { EventEmitter } from 'events';

export default () => {
    const emitter = new EventEmitter();
    
    try {
        Object.entries(eventListeners).forEach(([k, v]) => {
            if (typeof v === 'function'){
                v(k, emitter);
            }
        });
    } catch (err) {
        throw err;
    }

    return {
        "eventEmitter" : emitter
    }
}