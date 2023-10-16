import mongoose from "mongoose";

const schema = new mongoose.Schema({
  ID_transaccion: {
    type: String,
  },
  endpoint: {
    type: String,
    default:undefined
  },
   request: {
    type: Object,
    default:undefined

  },
  response:{
    type:Object,
    default:undefined

  },
  
  metodoEnviado:{
    type:String,
    default:undefined

  },
  clasificacionLOG:{
    type:String,
    default:undefined
  },
  ID_cupon:{
    type:String,
  }
  ,
    timeStamp:{
        type:Date,
        default: Date.now
    }
});

export default mongoose.model("LOGSCUPONES", schema);