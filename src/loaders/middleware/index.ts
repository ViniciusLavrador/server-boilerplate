import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

export default async ({app}: {app: express.Application}) => {
    
    // Coookie Parsing Middleware
    app.use(cookieParser());

    // Body Parsing Middleware for URL Encoded Requests
    app.use(bodyParser.urlencoded({extended: true}))

}