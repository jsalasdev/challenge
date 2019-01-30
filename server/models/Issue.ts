import { Schema, model, Document } from 'mongoose';
import { Repository } from './Repository';

export class IIssue {
    
    createdAt: Date
    title: string
    body: string
    owner: string
    repository: string
    state: string
    lock: {
        isLocked: boolean
        lockReason: string
    }

    constructor(data: {
        createdAt: Date
        title: string
        body: string
        owner: string
        repository: string
        state: string
        lock: {
            isLocked: boolean
            lockReason: string
        }
    }){
        this.createdAt = data.createdAt;
        this.title = data.title;
        this.body = data.body;
        this.owner = data.owner;
        this.repository = data.repository;
        this.state = data.state;
        this.lock = data.lock;
    }
}

const validateState = {
    values: ['open', 'closed'],
    message: '{VALUE} no es un estado válido.'
}

const validateLockReason = {
    values: ['spam','off-topic','too heated','resolved'],
    message: '{VALUE} no es una razón válida.'
}

const LockSchema = new Schema({
    isLocked : { type: Boolean, default: false },
    lockReason: { type: String, enum: validateLockReason }
});

const IssueSchema = new Schema({
    createdAt: { type: Date,default: Date.now },
    title: { type: String, required: true},
    body: { type: String, required: true },
    repository: {type: Schema.Types.ObjectId, ref: 'Repository', required: true},
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    state: { type: String, default: 'open', enum: validateState},
    lock: { type: LockSchema }
});

export interface IssueDocument extends IIssue, Document {};

export const Issue = model<IssueDocument>('Issue', IssueSchema);