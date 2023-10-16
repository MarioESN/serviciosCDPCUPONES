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
  fechaVigenciaAnterior: {
    type: String,
    default:"null"
  },
  fechaVigenciaNueva: {
    type: String,
    default:"null"
  },
   numeroRenovacion: {
    type: String,
    default:"0"
  },
  tipoRenovacion: {
    type: String,
    default:"tr"
  },
  timeStamp:{
    type:Date,
    default: Date.now
  }
});

export default mongoose.model("ASIGNACIONESCUPONES", schema);