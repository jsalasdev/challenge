import Server from './models/Server';

export const server = Server.instance;

server.start(() => {
    console.log(`Server corriendo en el puerto ${server.port}`);
});