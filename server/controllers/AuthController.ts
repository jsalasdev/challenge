import { Request, Response } from "express";
import { User, UserDocument } from '../models/User';
import * as Bcrypt from 'bcrypt';
import { generateToken } from '../middlewares/Authentication';

export let register = (res: Response, req: Request) => {
    let body = req.body;
    
    let user = new User({
        name: body.name,
        email: body.email,
        password: Bcrypt.hashSync(body.password, 10)
    });
    console.log(user);
    user.save((err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                ok: false,
                error: err.message
            });
        }
        
        res.json({
            ok: true,
            user
        });
    });
}

export let login = (res: Response, req: Request) => {
    let body = req.body;
    User.findOne({email: body.email}, (err:any, user:UserDocument) => {
        if(err){
            return res.status(500).json({
                ok: false,
                error:{
                    message: 'SERVER ERROR.'
                }
            });
        }
        
        if(!user){
            return res.status(400).json({
                ok: false,
                error:{
                    message: 'User o password incorrectos.'
                }
            });
        }else{
            Bcrypt.compare(body.password, user.password, function(err, pwRes) {
                if(pwRes){
                    res.json({
                        ok:true,
                        user,
                        token: generateToken(user)
                    });
                }else{
                    return res.status(400).json({
                        ok: false,
                        error:{
                            message: 'User o password incorrectos.'
                        }
                    });  
                }
            });
        }
        
    });
}