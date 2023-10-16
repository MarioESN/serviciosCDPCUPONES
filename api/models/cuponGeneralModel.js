import mongoose from "mongoose";

const schema = new mongoose.Schema({
  ID_transaccion: {
    type: String,
    default:"null"
  },
  ID_cupon: {
    type: String,
    unique: true,
  },
    ID_promo: {
    type: String,
    required: true,
  },
  ID_clubPetco: {
    type: String,
    required: true,
  },
  fecha_inicio :{
    type: String,
    default:undefined
  },
  fecha_fin:{
    type: String,
    default:undefined
  },
  tienda_favorita: {
    type: String,
    default:undefined
  },
  sendMail: {
    type:  Boolean,
    default:false
  },
  cuponEstatus: {
    type: String,
    default:null
  },
  ID_cuponTW: {
    type: String,
    unique: true,
    default:undefined
  },
  sendPush: {
    type:  Boolean,
    default:false
  },
  sendApp: {
    type:  Boolean,
    default:false
  },
  sendTW: {
    type:  Boolean,
    default:false
  },
  sendHana: {
    type:  Boolean,
    default:false
  },
  hora_inicio: {
    type: String,
    default:"000000"

  },
  hora_fin: {
    type: String,
    default:"235959"
  },
  codigoQr:{
    type: String,
    default:"null"
  },
  nombrePromo:{
    type:String,
    default:"null"
  },
  porcentaje:{
    type:String,
    default:"null"
  },
  pais:{
    type:String,
    default:"null"
  },
  __v:{
    type:String,
    default:"null"
  },
  condicion:{
    type:String,
    default:"null"
  },
  descripcion:{
    type:String,
    default:"null"
  },
  tipo:{
    type: String,
    default: "null"
  },
  urlProducto:{
    type:String,
    default:"null"
  },
  timeStamp:{
      type:Date,
      default: Date.now
  }
});

export default mongoose.model("CUPONESGENERALES", schema);