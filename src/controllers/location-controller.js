import {Router} from 'express';
import LocationService from './../services/location-service.js';
import EventLocationService from '../services/event_location-service.js';
import ValidationsHelper from '../helpers/validations-helper.js';
import Middleware from './../middlewares/authenticationMiddleware.js';
const mw = new Middleware();
const router = Router();
const svc = new LocationService();
const svc_el = new EventLocationService();
const v = new ValidationsHelper();

router.get('', async(req, res) => {
    const returnArray = await svc.getAllAsync();
    if(returnArray != null)
        return res.status(200).json(returnArray);
    else
        return res.status(500).send(`Error interno.`);
});

router.get('/:id', async (req, res) => { 
    let respuesta;
    if(v.isANumber(req.params.id))
    {
        const returnLocation = await svc.getByIdAsync(req.params.id);
        if(returnLocation != null)
            respuesta = res.status(200).json(returnLocation);
        else
            respuesta = res.status(404).send(`ID no encontrado.`);
    }
    else
        respuesta = res.status(400).send('Datos no válidos.');
    return respuesta;
});

router.get('/:id/event-location', mw.AuthMiddleware, async (req, res) => {
    let id = req.params.id;
    let respuesta;
    if (!v.isANumber(id)){
        respuesta = res.status(400).send('Bad request, id tiene que ser un número');
    }
    else{
        let locations = await svc_el.getByIdLocationAsync(id);
        respuesta = res.status(200).json(locations);
    }
    return respuesta;
})
export default router;