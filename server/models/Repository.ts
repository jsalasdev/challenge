import { Schema, model, Document } from 'mongoose';

export class IRepository {
    
    createdAt: Date
    name:string
    owner:string
    isPublic:boolean
    
    constructor(data: {
        createdAt: Date
        name:string
        owner:string
        isPublic:boolean
    }){
        this.createdAt = data.createdAt;
        this.name = data.name;
        this.owner = data.owner;
        this.isPublic = data.isPublic;
    }
}

const RepositorySchema = new Schema({
    createdAt: { type: Date,default: Date.now },
    name: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublic: { type: Boolean, default: true}
});

export interface RepositoryDocument extends IRepository, Document {};

export const Repository = model<RepositoryDocument>('Repository', RepositorySchema);
