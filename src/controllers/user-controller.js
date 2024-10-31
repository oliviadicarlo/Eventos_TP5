import {Router} from 'express';
import AuthService from '../services/auth-service.js';
import UserService from './../services/user-service.js';
import ValidationsHelper from '../helpers/validations-helper.js';
const router = Router();
const svc = new UserService();
const as = new AuthService();
const v = new ValidationsHelper();

router.get('', async(req, res) => {
    const returnArray = await svc.getAllAsync();
    if(returnArray != null)
        return res.status(200).json(returnArray);
    else
        return res.status(500).send(`Error interno.`);
});


router.get('/id/:id', async(req, res) => {
    let respuesta;
    console.log('estás haciendo el de buscar por id??')
    if(v.isANumber(req.params.id))
    {
        const returnUser = await svc.getByIdAsync(req.params.id);
        if(returnUser != null)
            respuesta = res.status(200).json(returnUser);
        else
            respuesta = res.status(500).send(`Error interno.`);
    }
    else
        respuesta = res.status(400).send('Datos no válidos.');
    return respuesta;
});

router.get('/username/:username', async (req, res) => { 
    let respuesta;
    console.log(req.params.username);
    const returnUser = await svc.getByUsernameAsync(req.params.username);
    if(returnUser != null)
        respuesta = res.status(200).json(returnUser);
    else
        respuesta = res.status(404).send(`Usuario no encontrado.`);
    return respuesta;
});

router.post('/login', async (req, res)=> {
    let returnValue, respuesta;
    try{
        returnValue = await as.login(req.body.username, req.body.password);
        respuesta = res.status(200).json(returnValue);
    }catch(error){
        console.log(error);
    }
    return respuesta;
})

router.post('/register', async (req, res)=>{
    let respuesta;
    let existentUser = await svc.getByUsernameAsync(req.username);
    if (existentUser)
        respuesta = res.status(400).send("Ya existe un usuario con ese username.");
    else{
        if (!v.validEmail(req.body.username)){
            respuesta = res.status(400).send("Email inválido.");
        }
        else if(!v.longerThan(3, req.body.first_name) || !v.longerThan(3, req.body.last_name)){
            respuesta = res.status(400).send("Nombre o apellido inválido. (tienen que tener más de tres letras)");
        }
        else if(!v.longerThan(2, req.body.password)){
            respuesta = res.status(400).send("La contraseña tiene que tener más de tres letras");
        }
        else{
            respuesta = res.status(200).send("Usuario creado.");
        }
    }
    return respuesta;
})

export default router;