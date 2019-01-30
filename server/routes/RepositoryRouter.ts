import { Request, Response } from 'express';
import * as repositoryController from '../controllers/RepositoryController';
import * as issueController from '../controllers/IssueController';
import { CustomRouter } from '../models/CustomRouter';
import { verifyJwt } from '../middlewares/Authentication';

export class RepositoryRouter extends CustomRouter {
    
    constructor() {
        super();
        this.registerRoutes();
    }
    
    registerRoutes(){
        this.router.post('', verifyJwt, this.addRepo);
        this.router.get('', verifyJwt, this.listRepos);
        this.router.put('/:idRepo', verifyJwt, this.editRepo);
        this.router.delete('/:idRepo', verifyJwt, this.deleteRepo);
        this.router.get('/:idRepo', verifyJwt, this.getRepo);
        this.router.post('/:idRepo/issues', verifyJwt, this.addIssue);
        this.router.get('/:idRepo/issues',verifyJwt, this.listIssuesRepo);
        this.router.put('/:idRepo/issues/:idIssue', verifyJwt, this.updateIssue);
        this.router.delete('/:idRepo/issues/:idIssue', verifyJwt, this.deleteIssue);
        this.router.put('/:idRepo/issues/:idIssue/lock', verifyJwt, this.lockIssue);
        this.router.delete('/:idRepo/issues/:idIssue/lock', verifyJwt, this.unlockIssue);
    }
    
    addRepo = (req: Request, res: Response) => {
        repositoryController.addRepo(res,req);
    }
    
    editRepo = (req: Request, res: Response) => {
        repositoryController.updateRepo(res,req);
    }
    
    deleteRepo = (req: Request, res: Response) => {
        repositoryController.deleteRepo(res,req);
    }
    
    getRepo = (req: Request, res: Response) => {
        repositoryController.getRepoById(res,req);
    }
    
    listRepos = (req: Request, res: Response) => {
        repositoryController.list(res,req);
    }
    
    addIssue = (req: Request, res: Response) => {
        issueController.addIssue(res, req);
    }
    
    updateIssue = (req: Request, res: Response) => {
        issueController.updateIssue(res, req);
    }
    
    deleteIssue = (req: Request, res: Response) => {
        issueController.deleteIssue(res, req);
    }
    
    lockIssue = (req: Request, res: Response) => {
        issueController.lockIssue(res,req);
    }

    unlockIssue = (req: Request, res: Response) => {
        issueController.unlockIssue(res,req);
    }
    
    listIssuesRepo = (req: Request, res: Response) => {
        issueController.listIssuesByIdRepo(res,req);
    }

}