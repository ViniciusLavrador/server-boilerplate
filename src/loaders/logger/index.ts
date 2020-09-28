import winston from 'winston';
import config from '../../config';

const transports = []

const emojiFormat = winston.format((info) => {
    if (!/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.test(info.message.slice(0, 2))) {
        var emoji: string;
        switch (info.level){
            case 'debug': emoji = '🔎'; break;
            case 'error': emoji = '⛔'; break;
            case 'http': emoji = '🌐'; break;
            case 'info': emoji = '📌'; break;
            case 'silly': emoji = '👻'; break;
            case 'verbose': emoji = '💬'; break;
            case 'warn': emoji = '⚡'; break;
            default: emoji = '';
        }
        
        info.message = `${emoji} ${info.message}`
        
    }

    return info;
})


if (process.env.NODE_ENV !== 'development') {
    // push a base console transponrt 
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(
                emojiFormat(),
            )
        })
    );
} else {
    // push a formatted console transport
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(
                emojiFormat(),
                winston.format.cli(),
                winston.format.splat(),   
            )
        })
    );
}

export default () => {

    return {
        logger: winston.createLogger({
            level: config.log.level,
            levels: winston.config.npm.levels,
            format: winston.format.combine(
                winston.format.timestamp({
                    format: "YYYY-MM-DD HH:mm:ss"
                }),
                winston.format.errors({stack: true}),
                winston.format.splat(),
                winston.format.json()
            ),
            transports
        }) 
    }
} 