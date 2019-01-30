import { Schema, model, Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

// BASIC DATA

export class IUser {
    
    createdAt: Date;
    name: string;
    email: string;
    password: string;
    
    constructor(data: {
        createdAt: Date;
        name: string;
        email: string;
        password: string;
    }){
        this.createdAt = data.createdAt;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
    }
}

const UserSchema = new Schema({
    createdAt: { type: Date,default: Date.now },
    name: { type: String },
    email: { type: String, required: true, unique:true },
    password: { type: String, required: true }
});

UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

UserSchema.plugin(uniqueValidator.default, {
    message: '{PATH} debe de ser único.'
});

export interface UserDocument extends IUser, Document {};

export const User = model<UserDocument>('User', UserSchema);