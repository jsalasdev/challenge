import { UserDocument } from '../models/User';
import { Repository, RepositoryDocument } from '../models/Repository';
import paginate from 'express-paginate';
import _ from "underscore";


export let getRepoById = (res:any, req:any) => {
    let idRepo = req.params.idRepo;
    if(!idRepo){
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Repository id expected.'
            }
        });
    }
    
    Repository.findById(idRepo)
    .exec((err: any, repo: RepositoryDocument) => {
        if (err || !repo) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'Repository not found.'
                }
            });
        }
        
        res.json({
            ok: true,
            repository: repo
        });
    });
}

export let addRepo = (res: any, req: any) => {
    
    let body = req.body;
    let user:UserDocument = req.user;
    console.log(body.isPublic);
    let repo = new Repository({
        name: body.name,
        isPublic: body.isPublic !== undefined ? body.isPublic : true,
        owner: user._id
    });
    
    repo.save((err, repository) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err.message
            });
        }
        res.json({
            ok: true,
            repository
        });
    });
}

export let updateRepo = (res:any, req:any) => {
    
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
        //this validation (check owner repository) can be done with middleware...
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
                let body = _.pick(req.body, ['name']);
                if(user._id == repo.owner){
                    Repository.findOneAndUpdate(idRepo, body, {new:true}, (err:any, updatedRepo:any) => {
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
                            repository: updatedRepo
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
        
        
    }
}

export let deleteRepo = (res:any, req:any) => {
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
        .exec((err:any, repo: RepositoryDocument)=> {
            
            if(err || !repo){
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Repository not found.'
                    }
                })
            }else{
                if(user._id == repo.owner){
                    Repository.deleteOne({_id:idRepo},(err:any) => {
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
                            repository: repo
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
    }
}

export let list = async(res:any, req:any) => {
    
    let search = req.query.search;
    let type = req.query.type;
    let user: UserDocument = req.user;
    
    if(type){
        let query:any = {}; 
        
        if(search && search!==''){
            let regex:any = {};
            regex['$regex'] = `${search}`;
            query['name'] = regex;
        }

        switch(type){
            case 'all':
            query['isPublic'] = true;
            listRepos(res,req,query);
            break;
            case 'own':
            query['owner'] = user._id;
            listRepos(res,req,query);
            break;
            default:
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Type ([all] or [own]) parameter expected.'
                }
            });
        }
    }else{
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Type parameter expected.'
            }
        });
    }    
}

//if choose "all" not show private repos
let listRepos = async(res:any, req:any, query:any) => {
    console.log(query);
    var [ results, itemCount ] = await Promise.all([
        Repository.find(query)
        .limit(req.query.limit)
        .skip(req.skip)
        .lean().exec(),
        Repository.count({})
    ]);
    
    var pageCount = Math.ceil(itemCount / req.query.limit);
    res.json({
        has_more: paginate.hasNextPages(req)(pageCount),
        repositories: results
    });
}