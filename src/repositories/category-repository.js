import DBHelper from '../helpers/database-helper.js';
const dbh = new DBHelper();

export default class CategoryRepository {
    getAllAsync = async () => {
        return dbh.request('SELECT * FROM event_categories');
    }

    getByIdAsync = async (id) =>
    {
        return dbh.requestOne('SELECT * FROM event_categories WHERE ID = $1', [id]);
    }

    createAsync = async (entity) =>
    {
        let sql, values;
            if(!entity.id)
            {
                sql = `INSERT INTO event_categories
                                (name, display_order)
                            VALUES
                                ($1,$2)`;
                values = [entity.name, entity.display_order];
            }
            else
            {
                sql = `INSERT INTO event_categories
                                (id, name, display_order)
                            VALUES
                                ($1,$2,$3)`;
                values = [entity.id, entity.name, entity.display_order];
            }
        return dbh.requestOne(sql, values)? true : false;
    }

    updateAsync = async (entity) => {
         return dbh.requestOne('UPDATE event_categories SET name = $1, display_order = $2 WHERE id = $3', 
                [entity.name, entity.display_order, entity.id])
    }

    deleteByIdAsync = async (id) => 
    {
        return dbh.requestOne('DELETE FROM event_categories WHERE id = $1', [id])
    }
}