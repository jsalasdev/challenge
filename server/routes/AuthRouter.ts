import { CustomRouter } from '../models/CustomRouter';
import { Request, Response } from 'express';
import * as authController from '../controllers/AuthController';

export class AuthRouter extends CustomRouter {
    
    constructor() {
        super();
        this.registerRoutes();
    }
    
    registerRoutes(){
        this.router.post('/login', this.login);
        this.router.post('/register', this.register);
    }
    
    login = (req: Request, res: Response) => {
        authController.login(res,req);
    }
    
    register = (req: Request, res: Response) => {
        authController.register(res,req);
    }
    
}