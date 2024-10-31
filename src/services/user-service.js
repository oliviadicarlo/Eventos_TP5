import UserRepository from '../repositories/user-repository.js';
const repo = new UserRepository();

export default class UserService {
    getAllAsync = async () => {
        const repo = new UserRepository();
        const returnArray = await repo.getAllAsync();
        return returnArray;
    }

    getByIdAsync = async (id) => {
        const repo = new UserRepository();
        const returnArray = await repo.getByIdAsync(id);
        return returnArray;
    }

    getByUsernameAndPasswordAsync = async (username, password) => {
        const returnArray = await repo.getByUsernameAndPasswordAsync(username, password);
        return returnArray;
    }

    getByUsernameAsync = async (username) => {
        const user = await repo.getByUsernameAsync(username);
        return user;
    }
}
