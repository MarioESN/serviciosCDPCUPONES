import http from 'http';
import api from './api/api.js';
import {mongocon} from './api/config/database.js';

const server = http.createServer(api);
const puerto = 3001;
server.on('listening', () => {
  console.log('Server corriendo en el puerto', puerto);
});

server.on('error', () => {
  console.log('Error al ejecutar el server en el puerto', puerto);
});

server.listen(puerto);
mongocon();