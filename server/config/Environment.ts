//=================================
// PORT
//=================================
export const SERVER_PORT:number = Number(process.env["PORT"]) || 3000;

//=================================
// ENVIRONMENT
//=================================
export const NODE_ENV:string = process.env["NODE_ENV"] || 'dev';

//=================================
// TOKEN EXPIRES
//=================================
//60segs * 60min * 24h * 30 days
export const TOKEN_EXPIRATION:any = '48h';

//=================================
// SEED TOKEN
//=================================
export const SEED:string = process.env["SEED"] || 'my-secret-dev';

//=================================
// DATABASE
//=================================
export let URL_DATABASE:string = '';

if (NODE_ENV === 'dev') {
    URL_DATABASE = 'mongodb://localhost:27017/challenge';
} else {
    URL_DATABASE = process.env["MONGO_URI"] || '';
}