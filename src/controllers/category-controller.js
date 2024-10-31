import {Router} from 'express';
import AuthMiddleware from '../middlewares/authenticationMiddleware.js';
import ValidationsHelper from '../helpers/validations-helper.js';
import CategoryService from './../services/category-service.js';
const router = Router();
const svc = new CategoryService();
const v = new ValidationsHelper();
const mw = new AuthMiddleware();

router.get('', mw.AuthMiddleware, async(req, res) => {
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
        const returnCategory = await svc.getByIdAsync(req.params.id);
        if(returnCategory != null)
            respuesta = res.status(200).json(returnCategory);
        else
            respuesta = res.status(404).send(`ID no encontrado.`);
    }
    else
        respuesta = res.status(400).send('Datos no válidos.');
    return respuesta;
});

router.post('/:id', async (req, res) => {
    let createdEntity = false;
    try {
        const entity = req.body;
        if (v.fullLetters(entity.name))
        {
            createdEntity = await svc.createAsync(entity);
        }
        if (createdEntity){
            return res.status(201).send("Categoría creada");
        }
        else
        {
            return res.status(400).send("Datos inválidos.")
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error interno.");
    }
});


router.put('/:id', async (req, res) => {
    if(
        v.isANumber(req.body.id) 
        && v.fullLetters(req.body.name)
      )
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
});


router.delete('/:id', async (req, res) => { 
    let respuesta;
    if (v.isANumber(req.params.id)) {
        try {
            await svc.deleteByIdAsync(req.params.id);
            respuesta = res.status(200).send("Ok.");
        } catch (error) {
            respuesta = res.status(500).send(error.message);
        }
    } else {
        respuesta = res.status(400).send(`Datos inválidos.`);
    }
    return respuesta;
});

export default router;