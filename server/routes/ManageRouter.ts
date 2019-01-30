import { CustomRouter } from '../models/customRouter';
import { AuthRouter } from './AuthRouter';
import { RepositoryRouter } from './RepositoryRouter';

export class ManageRouter extends CustomRouter{
    
    private authRoutes = new AuthRouter().export();
    private repoRoutes = new RepositoryRouter().export();

    constructor(){
        super();
        this.registerRoutes();
    }
    
    registerRoutes(){
        this.router.use('/auth', this.authRoutes);
        this.router.use('/repos', this.repoRoutes);
        this.router.get('/', function(_, res) {
            res.header('Content-Type', 'text/plain');
            res.json('The API is working !');
        });
    }
    
}