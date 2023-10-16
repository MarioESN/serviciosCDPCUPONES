import mysql2 from "mysql2/promise"
import mongoose  from "mongoose";
import ASIGNACIONESCUPONES from "../models/asignacionCuponModel.js"
import CUPONESGENERALES from '../models/cuponGeneralModel.js';
import LOGSCUPONES from "../models/logsCuponesModel.js"
import LOGSASIGNACIONESCUPONES from "../models/logsRenovacionCupones.js"




const createRegistroCuponGeneral = async (req, res,next) => {
  const{ fecha_fin }= req.body
  console.log("fecha fin",fecha_fin)
    try {
      const existeRegistro = await CUPONESGENERALES.exists({ ID_cupon:req.body.ID_promo+req.body.ID_clubPetco });
      console.log("existeRegistro",existeRegistro)
      if(existeRegistro){
        return res.status(200).json({msg:"El cupon ya tiene un  registro existente"})
      }
      const nuevoRegistroCupon = await CUPONESGENERALES.create(req.body);
      next()
    } catch (error) {
      if (error.code === 11000) {
        // Código 11000 indica un conflicto de índice único
        res.status(400).json({ mensaje: 'El cupon ya tiene un registro existente.' });
      } else {
        console.error('Error al guardar el dato:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
      }
    
    }
  };
  
  const actualizarRegistroAsignacionCupon = async (req, res) => {
    try {
      const existeRegistro = await CUPONESGENERALES.exists({ID_cupon:req.body.ID_promo+req.body.ID_clubPetco});
      const existeRegistro2 = await ASIGNACIONESCUPONES.exists({ ID_cupon:req.body.ID_promo+req.body.ID_clubPetco});
      const datos = await ASIGNACIONESCUPONES.findById(existeRegistro2)
      const numeroRenovacion= parseInt(datos.numeroRenovacion)
      const tipoRenovacion = datos.tipoRenovacion
      const fechaAnterior = datos.fechaVigenciaAnterior 
      console.log("registroencontrado", datos?datos:"no hay datos")
      console.log("numeroRenovacion", numeroRenovacion)
      console.log("tiporenovacion",tipoRenovacion)
      console.log("fechaAnterior",fechaAnterior)
      // console.log("existeRegistro",existeRegistro)
      // console.log("existeRegistro2",existeRegistro2)
      function calcularFecha30DiasDespues(fechaString,tipoRenovacion) {
        // Divide la fecha en día, mes y año
        const dia=fechaString.substring(6,8)
        const mes =fechaString.substring(4,6)
        const anio=fechaString.substring(0,4)
        console.log("numeroRenovacionusadoparaCalculardias",tipoRenovacion)
        // Crea una instancia de la fecha original
        const dias = tipoRenovacion=="tr"?30:180;
        console.log("dias",dias)
        const fechaOriginal = new Date(anio, mes - 1, dia); // Restamos 1 al mes porque en JavaScript los meses se cuentan desde 0 (enero) a 11 (diciembre)
      
        // Calcula la fecha que será dentro de 30 días
        const fecha30DiasDespues = new Date(fechaOriginal);
        fecha30DiasDespues.setDate(fecha30DiasDespues.getDate() + dias);
      
        // Obtiene el día, mes y año de la nueva fecha
        const nuevoDia = fecha30DiasDespues.getDate();
        const nuevoMes = fecha30DiasDespues.getMonth() + 1; // Sumamos 1 al mes para obtener el valor en formato de 1 a 12
        const nuevoAnio = fecha30DiasDespues.getFullYear();
      
        // Formatea la fecha para que tenga el mismo formato
        const fechaFormateada = `${nuevoAnio}${nuevoMes.toString().padStart(2,"0")}${nuevoDia.toString().padStart(2,"0")}`;
        console.log("nueva fecha de termino de cupon", fechaFormateada)
        return fechaFormateada;
      }
     const nuevafecha= calcularFecha30DiasDespues(fechaAnterior,tipoRenovacion)
     const nuevafecha2= calcularFecha30DiasDespues(nuevafecha,tipoRenovacion)
    if(existeRegistro && existeRegistro2){
      if(numeroRenovacion==0){
        const actualizarRegistro = await ASIGNACIONESCUPONES.updateOne({ ID_cupon:req.body.ID_promo+req.body.ID_clubPetco},{fechaVigenciaAnterior:fechaAnterior, fechaVigenciaNueva:nuevafecha, numeroRenovacion:numeroRenovacion+1,tipoRenovacion:req.body.tipoRenovacion})
      const registrarRenovacion = await LOGSASIGNACIONESCUPONES.create({ID_cupon:req.body.ID_promo+req.body.ID_clubPetco,fechaVigenciaAnterior:fechaAnterior, fechaVigenciaNueva:nuevafecha, numeroRenovacion:numeroRenovacion+1,tipoRenovacion:req.body.tipoRenovacion})
      res.json({
        msg:"se actualizo el registro de Asignacion de cupones"
      })
    console.log("se encontro un registo y se actualizo", existeRegistro)
      }else{
        const actualizarRegistro = await ASIGNACIONESCUPONES.updateOne({ ID_cupon:req.body.ID_promo+req.body.ID_clubPetco},{fechaVigenciaAnterior:nuevafecha, fechaVigenciaNueva:nuevafecha2, numeroRenovacion:numeroRenovacion+1,tipoRenovacion:req.body.tipoRenovacion})
        const registrarRenovacion = await LOGSASIGNACIONESCUPONES.create({ID_cupon:req.body.ID_promo+req.body.ID_clubPetco,fechaVigenciaAnterior:nuevafecha, fechaVigenciaNueva:nuevafecha2, numeroRenovacion:numeroRenovacion+1,tipoRenovacion:req.body.tipoRenovacion})
        res.json({
          msg:"se actualizo el registro de Asignacion de cupones"
        })
      console.log("se encontro un registo y se actualizo", existeRegistro)
      }
      

    }else{
       res.status(404).json({msg:"No se encontro ninguna coincidencia"})
    }
      
    } catch (error) {
      if (error.code === 11000) {
        // Código 11000 indica un conflicto de índice único
        res.status(400).json({ mensaje: 'El cupon ya tiene un registro existente.' });
      } else {
        console.error('Error al guardar el dato:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
      }
    
    }
  };

  const actualizarRegistroAsignacionCuponSQL = async (req,res,next)=>{
    const dbsql=await mysql2.createConnection({
      host: 'srvwebpet38w.cmzaajpza0fv.us-east-2.rds.amazonaws.com', // Cambia esto al host de tu base de datos MariaDB
      user: 'admin', // Cambia esto a tu nombre de usuario de la base de datos
      password: 'P3TC0dbW', // Cambia esto a tu contraseña de la base de datos
      database: 'CUPONES',
      port:3306
    })
    try {
      const query = 'SELECT * FROM ASIGNACIONESCUPONES WHERE ID_cupon = ? ';
      const [data] = await dbsql.execute(query, [req.body.ID_promo+req.body.ID_clubPetco]);
    // res.status(200).json({msg:"Registro de cupon creado correctamente en mariadb"})
    console.log("data encontrada", data[0])
    console.log("numeroRenovacionenDAta",data[0].numeroRenovacion)
    if(data){
      const query2="UPDATE ASIGNACIONESCUPONES SET numeroRenovacion = ?, fechaVigenciaAnterior = ?, fechaVigenciaNueva = ? WHERE ID_cupon = ?"
      const [data2]=await dbsql.execute(query2,[parseInt(data[0].numeroRenovacion)+1,req.body.fechaVigenciaAnterior,req.body.fechaVigenciaNueva,req.body.ID_promo+req.body.ID_clubPetco])
        await dbsql.end()
    }else{
       res.status(404).json({msg:"No se encontraron coincidencias en ASIGNACIONESCUPONES changeHANA"})
    }
    } catch (error) {
      console.error('Error al consultar datos en la base de datos', error);
      res.status(500).json({ mensaje: 'Error interno del servidor', error:error });
    } finally {
      dbsql.close(); // Close the database connection when done
      next()
    }
  }
 
  // inicia registros de logs en tablas LOGSCUPONES DE mongo y mariadb
  const createRegistroLOGScupon = async (req, res) => {
    const {ID_transaccion,endpoint,request,response,metodoEnviado,clasificacionLOG}=req.body
    try {
        const ID_cupon=req.body.ID_promo+req.body.ID_clubPetco
     const nuevoRegistroCupon = await LOGSCUPONES.create({ ID_transaccion:ID_transaccion,endpoint:endpoint,request:request,response:response,metodoEnviado:metodoEnviado,clasificacionLOG:clasificacionLOG,ID_cupon: ID_cupon});
     res.status(200).json({
       replyText:"Datos del cupon guardados correctamente",
     });
     
     
    } catch (error) {
      
        console.error('Error al guardar el dato:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    
    }
  };

  const createRegistroLOGSsql = async (req,res,next) =>{
    const dbsql=await mysql2.createConnection({
      host: 'srvwebpet38w.cmzaajpza0fv.us-east-2.rds.amazonaws.com', // Cambia esto al host de tu base de datos MariaDB
      user: 'admin', // Cambia esto a tu nombre de usuario de la base de datos
      password: 'P3TC0dbW', // Cambia esto a tu contraseña de la base de datos
      database: 'CUPONES',
      port:3306
    })
    try {
      // const query = 'SELECT * FROM CUPONESGENERAL WHERE ID_cupon = ? ';
      // console.log("id a buscar", req.body.ID_promo+req.body.ID_clubPetco)
      // const [data] = await dbsql.execute(query, [req.body.ID_promo+req.body.ID_clubPetco]);
    // console.log("data encontrada sql createlogcupon", data[0])
    // if(data.length>0){
      console.log("ree.body",req.body)
      const query2="INSERT INTO LOGSCUPONES (ID_transaccion,endpoint,request,response,horaGeneracion,metodoEnviado,clasificacionLOG,ID_cupon) VALUES (?, ?, ?, ?, ?, ?, ?,?)"
      const [data2]=await dbsql.execute(query2,[req.body.ID_transaccion,req.body.ID_transaccion,req.body.ID_transaccion,req.body.ID_transaccion,req.body.ID_transaccion,req.body.ID_transaccion,req.body.ID_transaccion,req.body.ID_promo+req.body.ID_clubPetco])
      //  res.status(200).json({msg:"resultado encontrado"})
        await dbsql.end()
    // }else{
    //   return res.status(404).json({msg:"el cupon no existe en CUPONESGENERALES"})
    // }
    } catch (error) {
      console.error('Error al consultar datos en la base de datos', error);
      res.status(500).json({ mensaje: 'Error interno del servidor', error:error });
    } finally {
      dbsql.close(); // Close the database connection when done
      next()
    }
  }

 // inicializa las tablas en sql y mongo CUPONESGENERAL Y ASIGNACIONESCUPONES
const createFirstInsertionCupones = async(req,res) => {
  const {ID_clubPetco,ID_promo,fecha_inicio,fecha_fin,tienda_favorita,codigoQr,nombrePromo,porcentaje,pais,__v,condicion,descripcion,tipo,urlProducto} = req.body
  console.log("ID_cupon",req.body.ID_promo+req.body.ID_clubPetco)
  try {
    const existeRegistroAsignaciones = await ASIGNACIONESCUPONES.exists({ID_cupon:req.body.ID_promo+req.body.ID_clubPetco});
    const existeRegistroGeneral = await CUPONESGENERALES.exists({ ID_cupon:req.body.ID_promo+req.body.ID_clubPetco});
    console.log("existeRegistroAsignaciones",existeRegistroAsignaciones)
    console.log("existeRegistroGENERAL",existeRegistroGeneral)
    if(existeRegistroAsignaciones || existeRegistroGeneral){
      return res.status(200).json({msg:"El cupon ya tiene un  registro existente"})
    }else{const nuevoRegistroCuponGeneral= await CUPONESGENERALES.create({ID_cupon:ID_promo+ID_clubPetco,ID_promo:ID_promo,ID_clubPetco:ID_clubPetco,fecha_inicio:fecha_inicio,fecha_fin:fecha_fin,tienda_favorita:tienda_favorita,codigoQr:codigoQr,nombrePromo:nombrePromo,porcentaje:porcentaje,pais:pais,__v:__v,condicion:condicion,descripcion:descripcion,tipo:tipo,urlProducto:urlProducto,ID_cuponTW:ID_promo+ID_clubPetco,cuponEstatus:"activado"})
    const nuevoRegistroCuponAsignacion = await ASIGNACIONESCUPONES.create({ID_cupon:ID_promo+ID_clubPetco,numeroRenovacion:"0", fechaVigenciaAnterior:req.body.fecha_fin?req.body.fecha_fin:"null",fechaVigenciaNueva:"null"});
    return res.status(200).json({
      replyCode:200,
      replyText:"Datos del cupon guardados correctamente",
      datosNuevoRegistroGeneral: nuevoRegistroCuponGeneral,
      datosNuevaAsignacion: nuevoRegistroCuponAsignacion,
    });}
    
  } catch (error) {
    if (error.code === 11000) {
      // Código 11000 indica un conflicto de índice único
      res.status(400).json({ mensaje: 'El cupon ya tiene un registro existente.',error:error });
    } else {
      console.error('Error al guardar el dato:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  
  }

} 

const guardarDatosSQLCUPONESGENERALES=async(req,res,next)=>{
  const {ID_clubPetco,ID_promo,fecha_inicio,fecha_fin,tienda_favorita,codigoQr,nombrePromo,porcentaje,pais,__v,condicion,descripcion,tipo,urlProducto}=req.body
  const timeStamp = Date.now()
  const dbsql=await mysql2.createConnection({
    host: 'srvwebpet38w.cmzaajpza0fv.us-east-2.rds.amazonaws.com', // Cambia esto al host de tu base de datos MariaDB
    user: 'admin', // Cambia esto a tu nombre de usuario de la base de datos
    password: 'P3TC0dbW', // Cambia esto a tu contraseña de la base de datos
    database: 'CUPONES',
    port:3306
  })
  try {
    const query = 'INSERT INTO CUPONESGENERAL (ID_cupon,ID_clubPetco, ID_promo, fecha_inicio, fecha_fin, tienda_favorita            ,sendMail, sendPush, cuponEstatus, ID_cuponTW          ,sendAPP, sendHANA,hora_inicio,hora_fin, codigoQr, nombrePromo, porcentaje, pais, __v, condicion, descripcion, tipo, urlProducto, timeStamp) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const [results] = await dbsql.execute(query, [ID_promo+ID_clubPetco,ID_clubPetco,ID_promo,fecha_inicio,fecha_fin,tienda_favorita,0       ,0         ,null        ,ID_promo+ID_clubPetco,0      ,0        ,"000000"   ,"235959",codigoQr  ,nombrePromo, porcentaje, pais, __v,condicion,descripcion,tipo,urlProducto,timeStamp]);
  // res.status(200).json({msg:"Registro de cupon creado correctamente en mariadb"})
  console.log("Se guardo informacion en mariadb cuponesgenerales")
    await dbsql.end()
  } catch (error) {
    console.error('Error al consultar datos en la base de datos', error);
    res.status(500).json({ mensaje: 'Error interno del servidor', error:error });
  } finally {
    dbsql.close(); // Close the database connection when done
    next()
  }

}

const guardarDatosSQLASIGNACIONCUPONES=async(req,res,next)=>{
  const numeroRenovacion=0
  const timeStamp = Date.now()
  const fechaVigenciaAnterior=req.body.fecha_inicio
  var fechaVigenciaNueva=null
  const ID_cupon= req.body.ID_promo+req.body.ID_clubPetco
  const dbsql=await mysql2.createConnection({
    host: 'srvwebpet38w.cmzaajpza0fv.us-east-2.rds.amazonaws.com', // Cambia esto al host de tu base de datos MariaDB
    user: 'admin', // Cambia esto a tu nombre de usuario de la base de datos
    password: 'P3TC0dbW', // Cambia esto a tu contraseña de la base de datos
    database: 'CUPONES',
    port:3306
  })
  try {
    const query2 = 'INSERT INTO ASIGNACIONESCUPONES (numeroRenovacion,fechaVigenciaAnterior,fechaVigenciaNueva,ID_cupon,timeStamp) VALUES (?,?,?,?,?)';
    const [results2] = await dbsql.execute(query2, [numeroRenovacion,fechaVigenciaAnterior,fechaVigenciaNueva,ID_cupon,timeStamp]);
  // res.status(200).json({msg:"Registro de cupon creado correctamente en mariadb"})
  console.log("Se guardo informacion en mariadb asignacion cupones")
    await dbsql.end()
  } catch (error) {
    console.error('Error al consultar datos en la base de datos', error);
    res.status(500).json({ mensaje: 'Error interno del servidor', error:error });
  } finally {
    dbsql.close(); // Close the database connection when done
    next()
  }
}

//cambia el estado de sendTW
const changeTWEstatus =async (req,res) => {
  try {
    const existeRegistro = await CUPONESGENERALES.exists({ ID_cupon:req.body.ID_promo+req.body.ID_clubPetco });
    console.log("existeRegistroChangetw", existeRegistro)
    if(existeRegistro){
      await CUPONESGENERALES.updateOne({ID_cupon:req.body.ID_promo+req.body.ID_clubPetco},{sendTW:true})
      res.status(200).json({msg:"Se actualizo el registro del cupón"})
    }else{
     res.status(400).json({msg:"El id del cupón cargado no existe en mongo"})
    }

  } catch (error) {
    console.log("error cahngesendtwestatus", error)
    res.status(400).json({
      msg:"error, el cupon no tiene un registro",
    })
  }
}

// cambia el estado de SENDMAIL
const changeMailEstatus =async (req,res) => {
  try {
    const existeRegistro = await CUPONESGENERALES.exists({ ID_cupon:req.body.ID_promo+req.body.ID_clubPetco });
    console.log("existeRegistroChangeMailEstatus", existeRegistro)
    if(existeRegistro){
      await CUPONESGENERALES.updateOne({ID_cupon:req.body.ID_promo+req.body.ID_clubPetco},{sendMail:true})
      res.status(200).json({msg:"Se actualizo el registro del cupón"})
    }else{
     res.status(400).json({msg:"El id del cupón cargado no existe en mongo"})
    }

  } catch (error) {
    console.log("error changemailestaus", error)
    res.status(400).json({
      msg:"error, el cupon no tiene un registro",
    })
  }
}

const changeMailEstatusSQL = async(req,res,next)=>{
  const dbsql=await mysql2.createConnection({
    host: 'srvwebpet38w.cmzaajpza0fv.us-east-2.rds.amazonaws.com', // Cambia esto al host de tu base de datos MariaDB
    user: 'admin', // Cambia esto a tu nombre de usuario de la base de datos
    password: 'P3TC0dbW', // Cambia esto a tu contraseña de la base de datos
    database: 'CUPONES',
    port:3306
  })
  try {
    const query = 'SELECT * FROM CUPONESGENERAL WHERE ID_cupon = ? ';
    console.log("id a buscar", req.body.ID_promo+req.body.ID_clubPetco)
    const [data] = await dbsql.execute(query, [req.body.ID_promo+req.body.ID_clubPetco]);
  // res.status(200).json({msg:"Registro de cupon creado correctamente en mariadb"})
  console.log("data encontrada sql changemailestatus", data)
  if(data){
    const query2="UPDATE CUPONESGENERAL SET sendMail = ? WHERE ID_cupon = ?"
    const [data2]=await dbsql.execute(query2,["1",req.body.ID_promo+req.body.ID_clubPetco])
    //  res.status(200).json({msg:"resultado encontrado"})
      await dbsql.end()
  }
  } catch (error) {
    console.error('Error al consultar datos en la base de datos', error);
    res.status(500).json({ mensaje: 'Error interno del servidor', error:error });
  } finally {
    dbsql.close(); // Close the database connection when done
    next()
  }
}

// cambiar estados de SENDPUSH
const changePushEstatus =async (req,res) => {
  try {
    const existeRegistro = await CUPONESGENERALES.exists({ ID_cupon:req.body.ID_promo+req.body.ID_clubPetco});
    if(existeRegistro){
      await CUPONESGENERALES.updateOne({ID_cupon:req.body.ID_promo+req.body.ID_clubPetco},{sendPush:true})
       res.status(200).json({msg:"Se actualizo el registro del cupón"})
    }else{
       res.status(400).json({msg:"El id del cupón cargado no existe"})
    }

  } catch (error) {
     res.status(400).json({
      msg:"error, el cupon no tiene un registro"
    })
  
  }
}

const changePushEstatusSQL = async(req,res,next)=>{
  const estatus = req.body.cuponEstatus
  const dbsql=await mysql2.createConnection({
    host: 'srvwebpet38w.cmzaajpza0fv.us-east-2.rds.amazonaws.com', // Cambia esto al host de tu base de datos MariaDB
    user: 'admin', // Cambia esto a tu nombre de usuario de la base de datos
    password: 'P3TC0dbW', // Cambia esto a tu contraseña de la base de datos
    database: 'CUPONES',
    port:3306
  })
  try {
    const query = 'SELECT * FROM CUPONESGENERAL WHERE ID_cupon = ? ';
    const [data] = await dbsql.execute(query, [req.body.ID_promo+req.body.ID_clubPetco]);
  // res.status(200).json({msg:"Registro de cupon creado correctamente en mariadb"})
  console.log("data encontrada sqlchangepush", data)
  if(data){
    const query2="UPDATE CUPONESGENERAL SET sendPush = ? WHERE ID_cupon = ?"
    const [data2]=await dbsql.execute(query2,["1",req.body.ID_promo+req.body.ID_clubPetco])
      await dbsql.end()
  }else{
     res.status(404).json({msg:"No se encontraron coincidencias en ASIGNACIONESCUPONES changePush"})
  }
  } catch (error) {
    console.error('Error al consultar datos en la base de datos', error);
    res.status(500).json({ mensaje: 'Error interno del servidor', error:error });
  } finally {
    dbsql.close(); // Close the database connection when done
    next()
  }
}

//cambiar estados de SENDAPP
const changeAppEstatus =async (req,res) => {
  try {
    const existeRegistro = await CUPONESGENERALES.exists({ ID_cupon:req.body.ID_promo+req.body.ID_clubPetco });
    if(existeRegistro){
      await CUPONESGENERALES.updateOne({ID_cupon:req.body.ID_promo+req.body.ID_clubPetco},{sendApp:true})
      res.status(200).json({msg:"Se actualizo el registro del cupón"})
    }else{
       res.status(400).json({msg:"El id del cupón cargado no existe en mongo"})
    }

  } catch (error) {
     res.status(400).json({
      msg:"error, el cupon no tiene un registro"
    })
  
  }
}

const changeAppEstatusSQL = async(req,res,next)=>{
  const estatus = req.body.cuponEstatus
  const dbsql=await mysql2.createConnection({
    host: 'srvwebpet38w.cmzaajpza0fv.us-east-2.rds.amazonaws.com', // Cambia esto al host de tu base de datos MariaDB
    user: 'admin', // Cambia esto a tu nombre de usuario de la base de datos
    password: 'P3TC0dbW', // Cambia esto a tu contraseña de la base de datos
    database: 'CUPONES',
    port:3306
  })
  try {
    const query = 'SELECT * FROM CUPONESGENERAL WHERE ID_cupon = ? ';
    const [data] = await dbsql.execute(query, [req.body.ID_promo+req.body.ID_clubPetco]);
  // res.status(200).json({msg:"Registro de cupon creado correctamente en mariadb"})
  console.log("data encontrada", data)
  if(data){
    const query2="UPDATE CUPONESGENERAL SET sendApp = ? WHERE ID_cupon = ?"
    const [data2]=await dbsql.execute(query2,["1",req.body.ID_promo+req.body.ID_clubPetco])
      await dbsql.end()
  }else{
   res.status(404).json({msg:"No se encontraron coincidencias en ASIGNACIONESCUPONES changeAPP"})
  }
  } catch (error) {
    console.error('Error al consultar datos en la base de datos', error);
    res.status(500).json({ mensaje: 'Error interno del servidor', error:error });
  } finally {
    dbsql.close(); // Close the database connection when done
    next()
  }
}

// cambiar estados de SENDHANA
const changeHanaEstatus =async (req,res) => {
  try {
    const existeRegistro = await CUPONESGENERALES.exists({ ID_cupon:req.body.ID_promo+req.body.ID_clubPetco });
    if(existeRegistro){
      await CUPONESGENERALES.updateOne({ID_cupon:req.body.ID_promo+req.body.ID_clubPetco},{sendHana:true})
       res.status(200).json({msg:"Se actualizo el registro del cupón"})
    }else{
       res.status(400).json({msg:"El id del cupón cargado no existe"})
    }

  } catch (error) {
     res.status(400).json({
      msg:"error, el cupon no tiene un registro"
    })
  
  }
}

const changeHanaEstatusSQL = async(req,res,next)=>{
  const estatus = req.body.cuponEstatus
  const dbsql=await mysql2.createConnection({
    host: 'srvwebpet38w.cmzaajpza0fv.us-east-2.rds.amazonaws.com', // Cambia esto al host de tu base de datos MariaDB
    user: 'admin', // Cambia esto a tu nombre de usuario de la base de datos
    password: 'P3TC0dbW', // Cambia esto a tu contraseña de la base de datos
    database: 'CUPONES',
    port:3306
  })
  try {
    const query = 'SELECT * FROM CUPONESGENERAL WHERE ID_cupon = ? ';
    const [data] = await dbsql.execute(query, [req.body.ID_promo+req.body.ID_clubPetco]);
  // res.status(200).json({msg:"Registro de cupon creado correctamente en mariadb"})
  console.log("data encontrada", data)
  if(data){
    const query2="UPDATE CUPONESGENERAL SET sendHANA = ? WHERE ID_cupon = ?"
    const [data2]=await dbsql.execute(query2,["1",req.body.ID_promo+req.body.ID_clubPetco])
      await dbsql.end()
  }else{
    res.status(404).json({msg:"No se encontraron coincidencias en ASIGNACIONESCUPONES changeHANA"})
  }
  } catch (error) {
    console.error('Error al consultar datos en la base de datos', error);
    res.status(500).json({ mensaje: 'Error interno del servidor', error:error });
  } finally {
    dbsql.close(); // Close the database connection when done
    next()
  }
}
// cambiar estados de cuponEstatus
const changeCuponEstatus =async (req,res) => {
  try {
    const existeRegistro = await CUPONESGENERALES.exists({ ID_cupon:req.body.ID_promo+req.body.ID_clubPetco });
    if(existeRegistro){
      await CUPONESGENERALES.updateOne({ID_cupon:req.body.ID_promo+req.body.ID_clubPetco},{cuponEstatus:req.body.cuponEstatus})
      res.status(200).json({msg:"Se actualizo el registro del cupón"})
    }else{
      res.status(400).json({msg:"El id del cupón cargado no existe"})
    }

  } catch (error) {
     res.status(400).json({
      msg:"error, el cupon no tiene un registro"
    })
  
  }
}
const changeCuponEstatusSQL = async(req,res,next)=>{
  const dbsql=await mysql2.createConnection({
    host: 'srvwebpet38w.cmzaajpza0fv.us-east-2.rds.amazonaws.com', // Cambia esto al host de tu base de datos MariaDB
    user: 'admin', // Cambia esto a tu nombre de usuario de la base de datos
    password: 'P3TC0dbW', // Cambia esto a tu contraseña de la base de datos
    database: 'CUPONES',
    port:3306
  })
  try {
    const query = 'SELECT * FROM CUPONESGENERAL WHERE ID_cupon = ? ';
    const [data] = await dbsql.execute(query, [req.body.ID_promo+req.body.ID_clubPetco]);
  // res.status(200).json({msg:"Registro de cupon creado correctamente en mariadb"})
  console.log("data encontrada", data)
  if(data){
    const query2="UPDATE CUPONESGENERAL SET cuponEstatus = ? WHERE ID_cupon = ?"
    const [data2]=await dbsql.execute(query2,[req.body.cuponEstatus,req.body.ID_promo+req.body.ID_clubPetco])
      await dbsql.end()
  }else{
     res.status(404).json({msg:"No se encontraron coincidencias en ASIGNACIONESCUPONES changeHANA"})
  }
  } catch (error) {
    console.error('Error al consultar datos en la base de datos', error);
    res.status(500).json({ mensaje: 'Error interno del servidor', error:error });
  } finally {
    dbsql.close(); // Close the database connection when done
    next()
  }
}


const replicarMongoASQL =async(req,res)=>{
  const dbsql=await mysql2.createConnection({
    host: 'srvwebpet38w.cmzaajpza0fv.us-east-2.rds.amazonaws.com', // Cambia esto al host de tu base de datos MariaDB
    user: 'admin', // Cambia esto a tu nombre de usuario de la base de datos
    password: 'P3TC0dbW', // Cambia esto a tu contraseña de la base de datos
    database: 'CUPONES',
    port:3306
  })
  // const borrarData = await mongoose.model("LOGSASIGNACIONESCUPONES").find()
  // const query5 = 'DELETE from LOGSASIGNACIONESCUPONES'
  
  // try {
  //   const seBorraOldData = await dbsql.execute(query5)
  // } catch (error) {
  //   console.log(error)
  // }
  //replica cuponesgenerales
//   const datosMongoCuponesGenerales= await mongoose.model("CUPONESGENERALES").find()
//   console.log("datosMongoCuponesGenerales",datosMongoCuponesGenerales)
//   for(const dato of datosMongoCuponesGenerales){
//     const datosAguardar={
//     ID_cupon:dato.ID_cupon,
//     ID_promo:dato.ID_promo,
//     ID_clubPetco:dato.ID_clubPetco,
//     fecha_inicio:dato.fecha_inicio,
//     fecha_fin:dato.fecha_fin,
//     tienda_favorita:dato.tienda_favorita,
//     sendMail:dato.sendMail,
//     cuponEstatus:dato.cuponEstatus,
//     ID_cuponTW:dato.ID_cuponTW,
//     sendPush:dato.sendPush,
//     sendAPP:dato.sendApp,
//     sendHANA:dato.sendHana,
//     hora_fin:dato.hora_fin,
//     condicion:dato.condicion,
//     descripcion:dato.descripcion,
//     tipo:dato.tipo,
//     urlProducto:dato.urlProducto,
//     timeStamp:dato.timeStamp
//   }

// const query='INSERT INTO CUPONESGENERAL           (ID_cupon     ,ID_promo     ,ID_clubPetco     ,fecha_inicio     ,fecha_fin     ,tienda_favorita     ,sendMail     ,cuponEstatus     ,ID_cuponTW     ,sendPush     ,sendAPP     ,sendHANA     ,hora_fin     ,condicion     ,descripcion     ,tipo     ,urlProducto     ,timeStamp     ,sendTW     ,codigoQr     ,nombrePromo     ,porcentaje     ,pais     ,__v) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
// try {
//   const seGuardoenMariadb=await dbsql.execute(query,[dato.ID_cupon,dato.ID_promo,dato.ID_clubPetco,dato.fecha_inicio,dato.fecha_fin,dato.tienda_favorita,dato.sendMail,dato.cuponEstatus,dato.ID_cuponTW,dato.sendPush,dato.sendApp,dato.sendHana,dato.hora_fin,dato.condicion,dato.descripcion,dato.tipo,dato.urlProducto,dato.timeStamp,dato.sendTW,dato.codigoQr,dato.nombrePromo,dato.porcentaje,dato.pais,dato.__v])
  
// } catch (error) {
//   console.log("error")
// }
//   }
  //replica asignacionescupones
  // const datosMongoAsignacionesCupones= await mongoose.model("ASIGNACIONESCUPONES").find()
  // for (const dato2 of datosMongoAsignacionesCupones){
  //   const datosAguardar2={
  //     ID_cupon:dato2.ID_cupon,
  //     fechaVigenciaAnterior:dato2.fechaVigenciaAnterior,
  //     fechaVigenciaNueva:dato2.fechaVigenciaNueva,
  //     numeroRenovacion:dato2.numeroRenovacion,
  //     tipoRenovacion:dato2.tipoRenovacion,
  //     timeStamp:dato2.timeStamp
  //   }
  //   const query2='INSERT INTO ASIGNACIONESCUPONES             (ID_cupon,fechaVigenciaAnterior      ,fechaVigenciaNueva      ,numeroRenovacion     ,tipoRenovacion       ,timeStamp ) VALUES (?,?,?,?,?,?)'
  //   try {
  //   const seGuardoenMariadb2=await dbsql.execute(query2,[dato2.ID_cupon,dato2.fechaVigenciaAnterior,dato2.fechaVigenciaNueva,dato2.numeroRenovacion,dato2.tipoRenovacion,dato2.timeStamp])
      
  //   } catch (error) {
  //     console.log("error")
  //   }
  // }
 //replica logsAsignacionescupones
//  const datosMongoLogsAsignacionesCupones= await mongoose.model("LOGSASIGNACIONESCUPONES").find()
//  for (const dato3 of datosMongoLogsAsignacionesCupones){
//    const datosAguardar3={
//      ID_cupon:dato3.ID_cupon,
//      fechaVigenciaAnterior:dato3.fechaVigenciaAnterior,
//      fechaVigenciaNueva:dato3.fechaVigenciaNueva,
//      numeroRenovacion:dato3.numeroRenovacion,
//      tipoRenovacion:dato3.tipoRenovacion,
//      timeStamp:dato3.timeStamp
//    }


//    const query3='INSERT INTO LOGSASIGNACIONESCUPONES   (ID_cupon,fechaVigenciaAnterior      ,fechaVigenciaNueva      ,numeroRenovacion     ,tipoRenovacion       ,timeStamp ) VALUES (?,?,?,?,?,?)'
//    try {
//     // const deleteOldData= await dbsql.execute(query5)

//    const seGuardoenMariadb3=await dbsql.execute(query3  ,[dato3.ID_cupon,dato3.fechaVigenciaAnterior,dato3.fechaVigenciaNueva,dato3.numeroRenovacion,dato3.tipoRenovacion,dato3.timeStamp])
     
//    } catch (error) {
//      console.log("error")
//    }
//  }



//replica logscupones


const datosMongoALOGSCUPONES = await mongoose.model("LOGSCUPONES").find()
console.log("cupones")
for(const dato4 of datosMongoALOGSCUPONES){
  const datosAguardar4={
    ID_transaccion:dato4.ID_transaccion,
    endpoint:dato4.endpoint,
    request:dato4.request,
    response:dato4.response,
    metodoEnviado:dato4.metodoEnviado,
    clasificacionLOG:dato4.clasificacionLOG,
    ID_cupon:dato4.ID_cupon,
    timeStamp:dato4.timeStamp
  }
  const query4='INSERT INTO LOGSCUPONES (ID_transaccion     ,endpoint      ,request      ,response      ,metodoEnviado     ,clasificacionLOG       ,ID_cupon      ,timeStamp) VALUES (?,?,?,?,?,?,?,?)'
  try {
    const seGuardoenMariadb4=await dbsql.execute(query4,[dato4.ID_transaccion,dato4.endpoint,dato4.request,dato4.response,dato4.metodoEnviado,dato4.clasificacionLOG,dato4.ID_cupon,dato4.timeStamp])
  } catch (error) {
    console.log("error",error)
  }
}




  res.status(200).json({msg:"Datos recuperados de mongo correctamente"})
}

const cargarIdTransaccionAMongos = async(req,res) =>{
try {
  const existeRegistro = await LOGSCUPONES.find({ ID_cupon:req.body.ID_promo+req.body.ID_clubPetco })
  console.log("registros encontrados",existeRegistro[0])
  const numeroTransaccion = existeRegistro[0].ID_transaccion
  console.log("----------------IDTransaccion------------------",numeroTransaccion)
  await CUPONESGENERALES.updateOne({ ID_cupon:req.body.ID_promo+req.body.ID_clubPetco },{ID_transaccion:numeroTransaccion})
  await ASIGNACIONESCUPONES.updateOne({ ID_cupon:req.body.ID_promo+req.body.ID_clubPetco },{ID_transaccion:numeroTransaccion})
  await LOGSASIGNACIONESCUPONES.updateOne({ ID_cupon:req.body.ID_promo+req.body.ID_clubPetco },{ID_transaccion:numeroTransaccion})
  res.status(200).json({msg:"todo bien",data:numeroTransaccion})
} catch (error) {
  console.log("error",error)
}

}

  export {createRegistroCuponGeneral,actualizarRegistroAsignacionCupon,createRegistroLOGScupon,createFirstInsertionCupones,changeMailEstatus,changePushEstatus,changeAppEstatus,changeHanaEstatus,changeCuponEstatus,guardarDatosSQLCUPONESGENERALES,guardarDatosSQLASIGNACIONCUPONES,changeMailEstatusSQL,changePushEstatusSQL,changeAppEstatusSQL,changeHanaEstatusSQL,changeCuponEstatusSQL,actualizarRegistroAsignacionCuponSQL,createRegistroLOGSsql,changeTWEstatus,replicarMongoASQL,cargarIdTransaccionAMongos}