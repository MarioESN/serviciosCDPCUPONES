import joi from 'joi';
const validateChangePetCoachEstatus = joi.object({
  ID_promo:joi.string().required(),
  ID_clubPetco:joi.string().required()
});

export default async (req, res, next) => {
  try {
    await validateChangePetCoachEstatus.validateAsync(req.body);
    next();     
  } catch (error) {
     res.status(400).json({
      msg: 'Error, faltan datos para guardar en la base de datos',
      error,
    });
  }
};