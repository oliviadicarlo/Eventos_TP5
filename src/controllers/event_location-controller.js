import {Router} from 'express';
import EventLocationService from '../services/event_location-service.js';
import AuthMiddleware from '../middlewares/authenticationMiddleware.js';
import ValidationsHelper from '../helpers/validations-helper.js';
const router = Router();
const svc = new EventLocationService();
const mw = new AuthMiddleware();
const v = new ValidationsHelper(); 

router.get('/', mw.AuthMiddleware, async(req, res) => {
    const returnArray = await svc.getAllAsync();
    if(returnArray != null)
        return res.status(200).json(returnArray);
    else
        return res.status(401).send(`Error 401. Unauthorized access.`);
});

router.get('/:id', mw.AuthMiddleware, async (req, res) => { 
    let respuesta;
    if(v.isANumber(req.params.id))
    {
        const returnEventLocation = await svc.getByIdAsync(req.params.id);
        if(returnEventLocation != null)
            respuesta = res.status(200).json(returnEventLocation);
        else
            respuesta = res.status(404).send(`ID no encontrado.`);
    }
    else
        respuesta = res.status(400).send('Datos no válidos.');
    return respuesta;
});

router.post('', mw.AuthMiddleware, async (req, res) => {
    try {
        let createdEntity;
        const returnEventLocation = await svc.getByIdLocationAsync(req.body.id_location);
        if (req.body.name == null || req.body.name.length < 3 || req.body.full_address == null || req.body.full_address.length < 3)
            respuesta = res.status(400).send("Bad request, nombre y dirección tienen que tener más de tres caracteres");
        if (v.isANumber(req.body.id_location))
        {
            if(returnEventLocation[0].id_location != req.body.id_location)
                respuesta = res.status(400).send("Bad request, id_location no existe en el contexto actual");
        }
        if(req.body.max_assistance > returnEventLocation[0].max_assistance) 
            respuesta = res.status(400).send("Bad request, la asistencia del evento excede los límites de la locación");   
        else
            createdEntity = await svc.createEventLocation(req.body);
            return res.status(200).send("Evento creado.");
            
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error interno.");
    }
});

router.put('', mw.AuthMiddleware, async(req, res) => {
    try {
        const eventLocation = await svc.getByIdAsync(req.body.id);
        if (!req.body.id) {
            return res.status(400).send("Bad request, id de la locación no existe en el contexto actual");
        }
        if (req.body.name == null || req.body.name.length < 3 || req.body.full_address == null || req.body.full_address.length < 3) {
            return res.status(400).send("Bad request, nombre y dirección tienen que tener más de tres caracteres");
        }
        if (req.body.max_capacity > eventLocation.max_capacity) {
            return res.status(400).send("Bad request, la asistencia del evento excede los límites de la locación");
        }
        let updatedEntity = await svc.updateEventLocation(req.body);
        return res.status(200).send("Información de la locación del evento actualizada.");

    } catch(error) {
        console.error(error);
        return res.status(500).send("Error en la actualización");
    }
});


router.delete('/:id', async (req, res) => {
    let respuesta, deleted;
    if (v.isANumber(req.params.id)) {
        try {
            deleted = await svc.deleteByIdAsync(req.params.id);
            respuesta = res.status(200).send("Ok.");
        } catch (error) {
            respuesta = res.status(500).send(error.message);
        }
    } else {
        respuesta = res.status(400).send(`Datos inválidos.`);
    }
    return deleted;
})
export default router;