import CategoryRepository from '../repositories/category-repository.js';

export default class CategoryService {
    getAllAsync = async () => {
        const repo = new CategoryRepository();
        const returnArray = await repo.getAllAsync();
        return returnArray;
    }

    getByIdAsync = async (id) => {
        const repo = new CategoryRepository();
        const returnArray = await repo.getByIdAsync(id);
        return returnArray;
    }

    createAsync = async (entity) => {
        const repo = new CategoryRepository();
        const created = await repo.createAsync(entity);
        return created;
    }
    updateAsync = async (entity) => {
        const repo = new CategoryRepository();
        const updated = repo.updateAsync(entity);
        return updated;
    }
    deleteByIdAsync = async (id) => {
        const repo = new CategoryRepository();
        const deleted = repo.deleteByIdAsync(id);
        return deleted;
    }
}