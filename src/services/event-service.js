import EventRepository from './../repositories/event-repository.js';

export default class EventService {
    getAll = async (offset, limit) => {
        const repo = new EventRepository();
        const returnArray = await repo.getAllAsync(offset, limit);
        return returnArray;
    }
    
    getByFilter = async (entity) => {
        const repo = new EventRepository();
        const returnArray = await repo.getByFilter(entity);
        return returnArray;
    }

    getById = async (id) => {
        const repo = new EventRepository();
        const returnArray = await repo.getById(id);
        return returnArray;
    }

    getDetails = async (id) => {
        const repo = new EventRepository();
        const event = await repo.getDetails(id);
        return event;
    }

    createEvent = async (entity) => {
        const repo = new EventRepository();
        const created = await repo.createEvent(entity);
        return created;
    }
}