import {Router} from 'express';
import EventService from './../services/event-service.js';
import EventLocationService from './../services/event_location-service.js';
import ValidationsHelper from '../helpers/validations-helper.js';
import UserService from '../services/user-service.js';
import EnrollmentService from '../services/enrollment-service.js';
import AuthMiddleware from '../middlewares/authenticationMiddleware.js';
const router = Router();
const svc = new EventService();
const v = new ValidationsHelper();
const am = new AuthMiddleware();
const svc_el = new EventLocationService();
const svc_enrollment = new EnrollmentService();
const svc_user = new UserService();


router.post('/:id/enrollment', am.AuthMiddleware, async(req, res) => {
    let idEvent = req.params.id;
    if(!v.isANumber(idEvent))
        return res.status(400).send("Id tiene que ser un número.");
    
    let event = await svc.getById(idEvent);
    let enrolled = await svc_enrollment.countEnrolledAsync(idEvent);
    if(enrolled == event.max_assistance)
    {
        return res.status(400).send("Superás la cantidad máxima de registros.");
    }
    let today = new Date();  
    if(event.start_date <= today){
        return res.status(400).send("Tenés que registrarte a un evento que sea mañana o después.");
    }
    if(!event.enabled_for_enrollment)
    {
        return res.status(400).send("El evento no está disponible para registros.");
    }    
    const user = await svc_user.getByUsernameAsync(req.user.username);
    const registered = await svc_enrollment.getByUserIdAndEventId(user.id, idEvent);
    if(registered)
    {
        return res.status(400).send("Ya te registraste para este evento antes.");
    }

    svc_enrollment.createAsync({
        "id_event": event.id,
        "id_user": user.id,
        "description": event.description,
    });
    return res.status(201).send("Te registraste.");
});

router.get('', async(req, res) => {
    const returnArray = await svc.getAll(req.query.pagina, req.query.limit);
    if(returnArray != null)
        return res.status(200).json(returnArray);
    else
        return res.status(500).send(`Error interno.`);
});

router.get('', async (req, res) => { 
    let data = await svc.getByFilter(req.query);
    return res.send(data);
});

router.get('/:id', async (req, res) => { 
    let data = await svc.getDetails(req.params.id);
    if (data){
        return res.status(200).send(data);
    }
    return res.status(404).send("Id no encontrado.");
});

router.post('', am.AuthMiddleware, async (req, res) => {
    try {
        const eventLocation = await svc_el.getByIdAsync(req.body.id_event_location);
        console.log('req.body: \n', req.body)
        
        if (!req.body.id_event_location) {
            return res.status(400).send("Bad request, id de la locación no existe en el contexto actual");
        }

        if (req.body.name == null || req.body.name.length < 3 || eventLocation.full_address == null || eventLocation.full_address.length < 3) {
            return res.status(400).send("Bad request, nombre y descripción tienen que tener más de tres caracteres");
        }

        if (req.body.max_assistance > eventLocation.max_capacity) {
            return res.status(400).send("Bad request, la asistencia del evento excede los límites de la locación");
        }

        if(req.body.price < 0 || req.body.duration_in_minutes < 0){
            return res.status(400).send("Bad request, la duración del evento o el precio son menores que 0");
        }
        let createdEntity = await svc.createEvent(req.body);
        return res.status(200).send("Evento creado.");
    } catch(error) {
        console.error(error);
        return res.status(500).send("Error en la creación");
    }
});

router.delete('/:id', am.AuthMiddleware, async (req, res) => {
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
//no estamos usando el validator, pero lo importamos por alguna razón

router.get('/enrollment/:id', async (req, res) =>{
    let respuesta;
    const id_event = req.params.id;
    const filtro = req.query;
    const returnArray = await svc_enrollment.getByEvent(id_event, filtro);
    if (returnArray != null)
    {
        respuesta = res.status(200).json(returnArray);
    }
    else respuesta = res.status(404).send('No hay resultados')
    return respuesta;
});

export default router;