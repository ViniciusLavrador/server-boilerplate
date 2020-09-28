import fs from 'fs';
import path from 'path';

var listeners = {}

fs.readdirSync(__dirname)
    .filter(dir => dir.indexOf('.ts') < 0)
    .forEach(dir => {
        const tmp = require(path.join(__dirname, dir)).default;
        if (typeof tmp === "function") {
            listeners[dir] = tmp             
        }
    });

export default listeners;