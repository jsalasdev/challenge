import { User, UserDocument } from '../models/User';
import { Repository, RepositoryDocument } from '../models/Repository';
import paginate from 'express-paginate';
import _ from "underscore";
import { Issue, IssueDocument } from '../models/Issue';

export let listIssuesByIdRepo = async (res:any, req:any) => {
    let idRepo = req.params.idRepo;
    let user: UserDocument = req.user;
    
    if(!idRepo){
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Repository id expected.'
            }
        });
    }else{
        Repository.findById(idRepo)
        .exec(async (err:any, repo: RepositoryDocument)=> {
            if(err || !repo){
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Repository not found.'
                    }
                });
            }else{
                let query:any = {}; 
                query['repository'] = repo._id;
                if((user._id == repo.owner) || repo.isPublic){
                    listIssues(res,req,query);
                }else{
                    return res.status(403).json({
                        ok: false,
                        error: {
                            message: 'Not permissions'
                        }
                    });
                }
            }
        });
    }
}

let listIssues = async(res:any, req:any, query:any) => {
    var [ results, itemCount ] = await Promise.all([
        Issue.find(query)
        .populate({ path:'repository', model: Repository, populate: { path: 'owner', Model: User, select: 'name isPremium'}})
        .limit(req.query.limit)
        .skip(req.skip)
        .lean().exec(),
        Issue.count({})
    ]);
    
    var pageCount = Math.ceil(itemCount / req.query.limit);
    res.json({
        has_more: paginate.hasNextPages(req)(pageCount),
        issues: results
    });
}

export let unlockIssue = (res:any, req:any) => {
    let idRepo = req.params.idRepo;
    let idIssue = req.params.idIssue;
    let user: UserDocument = req.user;
    
    if(!idRepo){
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Repository id expected.'
            }
        });
    }else{
        Repository.findById(idRepo)
        .exec((err:any, repo: RepositoryDocument)=> {
            if(err || !repo){
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Repository not found.'
                    }
                });
            }else{
                if(user._id == repo.owner){
                    Issue.findById(idIssue)
                    .exec((err:any, issue: IssueDocument)=> {
                        if(err || !issue){
                            return res.status(404).json({
                                ok: false,
                                error: {
                                    message: 'Issue not found.'
                                }
                            });
                        }else{
                            if(user._id == issue.owner){
                                if(issue.lock && !(issue.lock.isLocked)){
                                    return res.status(403).json({
                                        ok: false,
                                        error: {
                                            message: 'Issue is not locked.'
                                        }
                                    });
                                }else{
                                    issue.lock.isLocked = false;
                                    issue.lock.lockReason = "";
                                    issue.update(issue, (err, updatedIssue) => {
                                        if(err){
                                            return res.status(500).json({
                                                ok: false,
                                                error: {
                                                    message: 'SERVER ERROR.'
                                                }
                                            });
                                        }
                                        
                                        res.json({
                                            ok: true
                                        });
                                    });
                                }
                            }else{
                                return res.status(403).json({
                                    ok: false,
                                    error: {
                                        message: 'Not permissions'
                                    }
                                });
                            }
                        }
                    });
                }else{
                    return res.status(403).json({
                        ok: false,
                        error: {
                            message: 'Not permissions'
                        }
                    });
                }
            }
        });
    }
}

export let lockIssue = (res:any, req:any) => {
    let idRepo = req.params.idRepo;
    let idIssue = req.params.idIssue;
    let user: UserDocument = req.user;
    
    if(!idRepo){
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Repository id expected.'
            }
        });
    }else{
        Repository.findById(idRepo)
        .exec((err:any, repo: RepositoryDocument)=> {
            if(err || !repo){
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Repository not found.'
                    }
                });
            }else{
                if(user._id == repo.owner){
                    Issue.findById(idIssue)
                    .exec((err:any, issue: IssueDocument)=> {
                        if(err || !issue){
                            return res.status(404).json({
                                ok: false,
                                error: {
                                    message: 'Issue not found.'
                                }
                            });
                        }else{
                            if(user._id == issue.owner){
                                console.log(issue);
                                if(issue.lock && issue.lock.isLocked){
                                    return res.status(403).json({
                                        ok: false,
                                        error: {
                                            message: 'Issue is locked.'
                                        }
                                    });
                                }else{
                                    let data = req.body.lockReason;
                                    if(data){
                                        let body = {
                                            lock: {
                                                isLocked: true,
                                                lockReason: data
                                            }
                                        }
                                        Issue.findOneAndUpdate(idIssue, body, {new:true}, (err:any, updatedIssue:any) => {
                                            if(err){
                                                return res.status(400).json({
                                                    ok: false,
                                                    error: {
                                                        message: 'SERVER ERROR.'
                                                    }
                                                });
                                            }
                                            res.json({
                                                ok: true,
                                                issue: updatedIssue
                                            });
                                        });
                                    }else{
                                        return res.status(400).json({
                                            ok: false,
                                            error: {
                                                message: 'Lock reason expected.'
                                            }
                                        });
                                    }
                                }
                            }else{
                                return res.status(403).json({
                                    ok: false,
                                    error: {
                                        message: 'Not permissions'
                                    }
                                });
                            }
                        }
                    });
                }else{
                    return res.status(403).json({
                        ok: false,
                        error: {
                            message: 'Not permissions'
                        }
                    });
                }
            }
        });
    }
}

export let deleteIssue = (res:any, req:any) => {
    
    let idRepo = req.params.idRepo;
    let idIssue = req.params.idIssue;
    let user: UserDocument = req.user;
    
    if(!idRepo){
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Repository id expected.'
            }
        });
    }else{
        Repository.findById(idRepo)
        .exec((err:any, repo: RepositoryDocument)=> {
            if(err || !repo){
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Repository not found.'
                    }
                });
            }else{
                if(user._id == repo.owner){
                    Issue.findById(idIssue)
                    .exec((err:any, issue: IssueDocument)=> {
                        if(err || !issue){
                            return res.status(404).json({
                                ok: false,
                                error: {
                                    message: 'Issue not found.'
                                }
                            });
                        }else{
                            if(user._id == issue.owner){
                                let body = _.pick(req.body, ['title', 'body']);
                                Issue.deleteOne({_id: issue._id}, (err:any) => {
                                    if(err){
                                        return res.status(400).json({
                                            ok: false,
                                            error: {
                                                message: 'SERVER ERROR.'
                                            }
                                        });
                                    }
                                    res.json({
                                        ok: true,
                                        issue
                                    });
                                });
                            }else{
                                return res.status(403).json({
                                    ok: false,
                                    error: {
                                        message: 'Not permissions'
                                    }
                                });
                            }
                        }
                    });
                }else{
                    return res.status(403).json({
                        ok: false,
                        error: {
                            message: 'Not permissions'
                        }
                    });
                }
            }
        });
    }
    
}

export let updateIssue = (res:any, req:any) => {
    let idRepo = req.params.idRepo;
    let idIssue = req.params.idIssue;
    let user: UserDocument = req.user;
    
    if(!idRepo){
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Repository id expected.'
            }
        });
    }else{
        Repository.findById(idRepo)
        .exec((err:any, repo: RepositoryDocument)=> {
            if(err || !repo){
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Repository not found.'
                    }
                });
            }else{
                if(user._id == repo.owner){
                    Issue.findById(idIssue)
                    .exec((err:any, issue: IssueDocument)=> {
                        if(err || !issue){
                            return res.status(404).json({
                                ok: false,
                                error: {
                                    message: 'Issue not found.'
                                }
                            });
                        }else{
                            if(user._id == issue.owner){
                                let body = _.pick(req.body, ['title', 'body','state']);
                                Issue.findOneAndUpdate(idIssue, body, {new:true}, (err:any, updatedIssue:any) => {
                                    if(err){
                                        return res.status(400).json({
                                            ok: false,
                                            error: {
                                                message: 'SERVER ERROR.'
                                            }
                                        });
                                    }
                                    res.json({
                                        ok: true,
                                        issue: updatedIssue
                                    });
                                });
                            }else{
                                return res.status(403).json({
                                    ok: false,
                                    error: {
                                        message: 'Not permissions'
                                    }
                                });
                            }
                        }
                    });
                }else{
                    return res.status(403).json({
                        ok: false,
                        error: {
                            message: 'Not permissions'
                        }
                    });
                }
            }
        });
    }
}

export let addIssue = (res: any, req: any) => {
    let idRepo = req.params.idRepo;
    let user: UserDocument = req.user;
    let body = req.body;
    
    if(!idRepo){
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Repository id expected.'
            }
        });
    }else{
        console.log(idRepo);
        Repository.findById(idRepo)
        .exec((err:any, repo: RepositoryDocument)=> {
            console.log(repo);
            if(err || !repo){
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Repository not found.'
                    }
                });
            }else{
                if(user._id == repo.owner){
                    if(body.title && body.body){
                        
                        let issue = new Issue({
                            title: body.title,
                            body: body.body,
                            owner: user._id,
                            repository: repo._id
                        });
                        issue.save((err, issue) => {
                            if(err){
                                return res.status(400).json({
                                    ok: false,
                                    error: err.message
                                });
                            }
                            res.json({
                                ok: true,
                                issue
                            });
                        });
                        
                    }else{
                        return res.status(400).json({
                            ok: false,
                            error: {
                                message: 'Title and body expected.'
                            }
                        });
                    }
                }else{
                    return res.status(403).json({
                        ok: false,
                        error: {
                            message: 'Not permissions'
                        }
                    });
                }
            }
        });
        
        
    }
}