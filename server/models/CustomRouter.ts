import { Router } from 'express';

export abstract class CustomRouter {
    
  protected router: Router;

  constructor() {
    this.router = Router();
  }

  /** Export internal router to be used as Express middleware */
  export = (): Router => this.router;
}

module.exports = {
  CustomRouter
}