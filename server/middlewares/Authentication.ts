import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { SEED, TOKEN_EXPIRATION } from '../config/Environment';

export let verifyJwt = (req: any, res: Response, next:any) => {
    let token:string = req.get('token') || '';
    if(token === ''){
        return res.status(401).json({
            ok: false,
            error: {
                message: 'Token no válido'
            }
        });
    }else{
        jwt.verify(token, SEED, (err, decoded:any) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    error: {
                        message: 'Token no válido'
                    }
                });
            }
            req.user = decoded.user;
            next();
        });
    }
};

export let generateToken = (user:any)=>{
    return jwt.sign({
        user
    }, SEED);
// }, SEED, {expiresIn: TOKEN_EXPIRATION});
};