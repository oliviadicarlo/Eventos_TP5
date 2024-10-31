import ProvinceRepository from '../repositories/province-repository.js';

export default class ProvinceService {
    getAllAsync = async () => {
        const repo = new ProvinceRepository();
        const returnArray = await repo.getAllAsync();
        return returnArray;
    }
    getByIdAsync = async (id) => {
        const repo = new ProvinceRepository();
        const returnArray = await repo.getByIdAsync(id);
        return returnArray;
    }
    createAsync = async (entity) => {
        const repo = new ProvinceRepository();
        const created = await repo.createAsync(entity);
        return created;
    }
    updateAsync = async (entity) => {
        const repo = new ProvinceRepository();
        const updated = repo.updateAsync(entity);
        return updated;
    }
    deleteByIdAsync = async (id) => {
        const repo = new ProvinceRepository();
        const deleted = repo.deleteByIdAsync(id);
        return deleted;
    }

    getLocationsAsync = async (id) => {
        const repo = new ProvinceRepository();
        const returnValues = await repo.getLocationsAsync(id);
        return returnValues;
    }
}
