import mongoose from 'mongoose';
const db = mongoose.connection;



db.on('connecting', () => {
  console.log('Intentando conectar a la base de datos en mongo ');
});

db.on('connected', () => {
  console.log('Se conectó a la base en mongo');
});

db.on('error', () => {
  console.log('Error en la conexión de DB de mongo ');
});

const mongocon= () => {
  mongoose.connect("mongodb://localhost:27017/CUPONES");//uri de mongodb
  // mongoose.connect("mongodb+srv://Alansiqui:Alansiqui123@petco.tlfunvt.mongodb.net/ENCUESTA_GENESYS?");//uri de mongodb

};

export { mongocon}