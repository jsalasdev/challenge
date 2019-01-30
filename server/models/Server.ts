import express from 'express';
import http from 'http';
import { SERVER_PORT, URL_DATABASE } from '../config/Environment';
import { ManageRouter } from '../routes/ManageRouter';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import paginate from 'express-paginate';


export default class Server{
    
    private static _instance: Server;
    private manageRouter = new ManageRouter().export();
    public app: express.Application;
    public port: number;
    private httpServer: http.Server;
    
    private constructor(){
        this.app = express();
        this.configureParser();
        this.configureCors();
        this.configurePagination();
        this.port = SERVER_PORT;
        this.routes();
        this.configureMongo();
        this.httpServer = new http.Server(this.app);
    }
    
    configureMongo(){
        mongoose.connect(URL_DATABASE, { useNewUrlParser:true }, (err) => {
            if(err) throw err;
            console.log('Base de datos conectada.');
        });
    }

    configurePagination(){
        this.app.use(paginate.middleware(10,50));
    }

    configureCors(){
        this.app.use(cors({origin: true, credentials: true}));
    }

    configureParser(){
        this.app.use(bodyParser.urlencoded({ extended:true }));
        this.app.use(bodyParser.json());
    }

    routes(){
        this.app.use('/api', this.manageRouter);
    }
    
    public static get instance(){
        return this._instance || (this._instance = new this());
    }
    
    start(callback: Function){
        this.httpServer.listen(this.port, callback);
    }
}