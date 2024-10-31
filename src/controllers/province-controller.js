import {Router} from 'express';
import ProvinceService from './../services/province-service.js';
import ValidationsHelper from '../helpers/validations-helper.js';
const router = Router();
const svc = new ProvinceService();
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
        const returnProvince = await svc.getByIdAsync(req.params.id);
        if(returnProvince != null)
            respuesta = res.status(200).json(returnProvince);
        else
            respuesta = res.status(500).send(`Error interno.`);
    }
    else
        respuesta = res.status(400).send('Datos no válidos.');
    return respuesta;
})

router.post('/:id', async (req, res) => {
    let createdEntity = false;
    try {
        const entity = req.body;
        if (
            v.fullLetters(entity.name) &&
            v.fullLetters(entity.full_name) &&
            v.latitudeLongitude(entity.latitude, entity.longitude)
            )
        {
            createdEntity = await svc.createAsync(entity);
        }
        if (createdEntity){
            return res.status(201).send("Provincia creada");
        }
        else
        {
            return res.status(400).send("Datos inválidos.")
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error interno.");
    }
})


router.put('/:id', async (req, res) => {
    if(
        v.isANumber(req.body.id) 
        && v.fullLetters(req.body.name) 
        && v.fullLetters(req.body.full_name)
        && v.latitudeLongitude(req.body.latitude, req.body.longitude))
    {
        try{
            const entity = req.body;
            await svc.updateAsync(entity);
            return res.status(200).send("Ok.");
        } catch (error){
            console.error(error);
            return res.status(500).send("Error interno.");
        }
    }
    return res.status(400).send("Datos inválidos.");
})

router.delete('/:id', async (req, res) => {
    if(v.isANumber(req.params.id))
    {
        try{
            await svc.deleteByIdAsync(req.params.id);
            return res.status(200).send("Ok.");
        }
        catch(error){
            respuesta = res.status(400).send(error);
        }
    }
    else
        respuesta = res.status(400).send(`Datos inválidos.`);

    return respuesta;
})

router.get('/:id/locations', async (req, res) => {

    let respuesta;
    if(v.isANumber(req.params.id))
    {
        const returnLocations = await svc.getLocationsAsync(req.params.id);
        if(returnLocations != null)
            respuesta = res.status(200).json(returnLocations);
        else
            respuesta = res.status(500).send(`Error interno.`);
    }
    else
        respuesta = res.status(400).send('Datos no válidos.');
    return respuesta;
});

export default router;