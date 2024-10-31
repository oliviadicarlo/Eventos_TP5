import jwt from 'jsonwebtoken';
import userService from './user-service.js'
const usersvc = new userService();

export default class AuthService {
    secretKey = "l0Qu3V0sQu13r@5";

    generateToken = async (user) => {
        const payload = {
            username: user.username,
            password: user.password
        };
        const options = {
            expiresIn : '7d'
        }
        return jwt.sign(payload, this.secretKey, options);
    }

    decryptToken = async (token) => {
        let payloadOg = null;
        try{
            payloadOg = jwt.verify(token, this.secretKey);
        } catch (error){
            console.log(error);
        }
        return payloadOg;
    }

    login = async (username, password) => {
        let returnValue = {username: username, password: password};
        const user = await usersvc.getByUsernameAndPasswordAsync(username, password);
        if(user != null){
            returnValue.token = await this.generateToken(user);
            returnValue.success = true;
        }
        else {
            returnValue.message = "Usuario o clave inválida.";
        }
        return returnValue;
    }
}