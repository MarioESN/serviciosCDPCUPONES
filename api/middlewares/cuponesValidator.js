import joi from 'joi';

const createRegistroCupones = joi.object({
  // ID_llamada: joi.string().required(),
  ID_promo: joi.string().required(),
  ID_clubPetco: joi.string().required(),
  fecha_inicio: joi.string().required(),
  fecha_fin: joi.string().required(),
  tienda_favorita: joi.string().required(),
  codigoQr: joi.string().required()
  ,nombrePromo: joi.string().required()
  ,porcentaje: joi.string().required()
  ,pais: joi.string().required()
  ,__v: joi.string().required()
  ,condicion: joi.string().required()
  ,descripcion: joi.string().required()
  ,tipo: joi.string().required()
  ,urlProducto: joi.string().required(),
  tipoRenovacion:joi.string().required(),
});

export default async (req, res, next) => {
  try {
    await createRegistroCupones.validateAsync(req.body);
    next();     
  } catch (error) {
    return res.status(400).json({
      msg: 'Error, faltan datos para guardar en la base de datos',
      error,
    });
  }
};