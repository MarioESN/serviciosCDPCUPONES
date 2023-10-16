import joi from "joi";
const validateDatosAReplicar=joi.object({

})

export default async (req,res,next)=>{
    try {
        
    } catch (error) {
        res.status(400).json({
            msg:"Error con los datos, no se puede replicar",
            error:error
        })
    }
}