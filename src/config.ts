export const portNumber = 8000;

export const logFormat = 'dev';

export const sessionOptions = {
    secret: 'bunnyslippers',
    saveUninitialized: false,
    resave: false,
};

export const cloudDirectory = 5;

export const db = {
    username: undefined as string | undefined,
    password: undefined as string | undefined,
    hostname: 'localhost',
    dbname: 'comp431'
}