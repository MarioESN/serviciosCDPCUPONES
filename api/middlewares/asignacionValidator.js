import joi from 'joi';

const createRegistroAsignacionCupones = joi.object({
  // ID_llamada: joi.string().required(),
  ID_promo:joi.string().required(),
  ID_clubPetco:joi.string().required(),

});

export default async (req, res, next) => {
  try {
    await createRegistroAsignacionCupones.validateAsync(req.body);
    next();     
  } catch (error) {
    return res.status(400).json({
      msg: 'Error, faltan datos para guardar en la base de datos',
      error,
    });
  }
};