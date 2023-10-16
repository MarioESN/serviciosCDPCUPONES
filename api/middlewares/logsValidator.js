import joi from 'joi';
const createRegistroLOGScupones = joi.object({
  ID_transaccion:joi.string().required(),
  endpoint:joi.string().required(),
  request:joi.required(),
  response:joi.required(),
  metodoEnviado:joi.string().required(),
  clasificacionLOG:joi.string().required(),
  ID_promo:joi.string().required(),
  ID_clubPetco:joi.string().required()
});

export default async (req, res, next) => {
  try {
    await createRegistroLOGScupones.validateAsync(req.body);
    next();     
  } catch (error) {
    return res.status(400).json({
      msg: 'Error, faltan datos para guardar en la base de datos',
      error,
    });
  }
};