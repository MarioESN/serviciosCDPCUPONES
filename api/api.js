import express from 'express';
import { createRegistroCuponGeneral,actualizarRegistroAsignacionCupon,createRegistroLOGScupon, createFirstInsertionCupones,changeMailEstatus,changePushEstatus,changeAppEstatus, changeTWEstatus,changeHanaEstatus,changeCuponEstatus, replicarMongoASQL,cargarIdTransaccionAMongos,guardarDatosSQLCUPONESGENERALES, guardarDatosSQLASIGNACIONCUPONES,changeMailEstatusSQL,changePushEstatusSQL, changeAppEstatusSQL,changeHanaEstatusSQL, changeCuponEstatusSQL,actualizarRegistroAsignacionCuponSQL,createRegistroLOGSsql} from './controllers/cuponesController.js';
import cuponesValidator from './middlewares/cuponesValidator.js';
import asignacionValidator from './middlewares/asignacionValidator.js';
import logsValidator from "./middlewares/logsValidator.js"
import changePetcoachValidator from "./middlewares/chagePetcoachValidator.js"
import changeEstatusCuponValidator from "./middlewares/changeEstatusCuponValidator.js"
import replicarValidator from "./middlewares/replicarValidator.js"
const api = express();
api.use(express.json());


api.get('/status', (_, res) => {
  return res.json({
    msg: 'API funcionando correctamente',
  });
});

// api.post("/encuestas_genesys",encuestaValidator,createEncuentaGenesys)
api.post("/cdp/cuponesGeneral",cuponesValidator,createRegistroCuponGeneral)

// actualiza las veces que el cupon se a lanzado al cliente y las fechas de 
// api.post("/cdp/actualizarAsignacionCupones",asignacionValidator,actualizarRegistroAsignacionCuponSQL,actualizarRegistroAsignacionCupon)
api.post("/cdp/actualizarAsignacionCupones",asignacionValidator,actualizarRegistroAsignacionCupon)


//inicia un registro de en las tablas LOGSCUPONES de mariadb y mongodb
// api.post("/cdp/registrarLOGSCupones",logsValidator,createRegistroLOGSsql,createRegistroLOGScupon)
// api.post("/cdp/registrarLOGSCupones",logsValidator,createRegistroLOGScupon)
api.post("/cdp/registrarLOGSCupones",createRegistroLOGScupon)

//inicia registro de cupones, guarda informacion del cupon los send´s en falso o 0 e inicializa un registro en ASIGNACIONESCUPONES con el numero de renovacion en ceros
// api.post("/cdp/iniciarRegistroCupones",cuponesValidator,guardarDatosSQLCUPONESGENERALES,guardarDatosSQLASIGNACIONCUPONES,createFirstInsertionCupones)
api.post("/cdp/iniciarRegistroCupones",cuponesValidator,createFirstInsertionCupones)

// cambia el estado de sendMail en mongo y sql, dependiendo si ya existe un registro previo
// api.post("/cdp/changeSendMail",changePetcoachValidator,changeMailEstatusSQL,changeMailEstatus)
api.post("/cdp/changeSendMail",changePetcoachValidator,changeMailEstatus)

// cambia el estado de sendPush en mongo y sql, dependiendo si ya existe un registro previo
// api.post("/cdp/changeSendPush",changePetcoachValidator,changePushEstatusSQL,changePushEstatus)
api.post("/cdp/changeSendPush",changePetcoachValidator,changePushEstatus)

// cambia el estado de sendApp en mongo y sql, dependiendo si ya existe un registro previo
// api.post("/cdp/changeSendApp",changePetcoachValidator,changeAppEstatusSQL,changeAppEstatus)
api.post("/cdp/changeSendApp",changePetcoachValidator,changeAppEstatus)

//cambia el estado de sendHana en mongo y sql, dependiendo si ya existe un registro previo
// api.post("/cdp/changeSendHana",changePetcoachValidator,changeHanaEstatusSQL,changeHanaEstatus)
api.post("/cdp/changeSendHana",changePetcoachValidator,changeHanaEstatus)

// cambia el estado de estatusCupon en mongo y sql, dependiendo si ya existe un registro previo.
// api.post("/cdp/changeEstatusCupon",changeEstatusCuponValidator,changeCuponEstatusSQL,changeCuponEstatus)
api.post("/cdp/changeEstatusCupon",changeEstatusCuponValidator,changeCuponEstatus)


//cambia el estado de sendTW en mongo y sql, dependiendo si ya existe un registro previo
api.post("/cdp/changeSendTW",changePetcoachValidator,changeTWEstatus)


api.post("/cdp/fixTransacionIdMongo", cargarIdTransaccionAMongos)
//ruta para replicar
api.post("/cdp/replicarMongoASQL",replicarMongoASQL)

// endpoint usada para pruebas 
api.post("/pruebadeendpoints",cargarIdTransaccionAMongos)





export default api;
