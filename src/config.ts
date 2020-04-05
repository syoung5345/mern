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

export const jwtSecret = 'it\'s a secret to everybody';

export const ecryptionData = {
    iterations: 10000,
    length: 256,
    hashAlg: 'sha512'
}