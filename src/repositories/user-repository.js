import DBHelper from '../helpers/database-helper.js';
const dbh = new DBHelper();

export default class UserRepository {
    getAllAsync = async () => {
        return dbh.request('SELECT * FROM public.users;');
    }

    getByIdAsync = async (id) =>
    {
        return dbh.requestOne('SELECT * FROM public.users WHERE ID = $1;', [id]);
    }

    getByUsernameAndPasswordAsync = async (username, password) =>
    {
        return dbh.requestOne('SELECT * FROM public.users WHERE username = $1 AND password = $2;', [username, password]);
    }

    getByUsernameAsync = async (username) =>{
        return dbh.requestOne('SELECT * FROM public.users WHERE username = $1;', [username]);
    }

    /* PUNTO 5 
    falta terminar de editar el código, perdón re lento todo pero lo que me dejó mi mano :(( ))
    getByFilter = async (entity) => {
        let params = [];
        let conditions = [];

        let query = `SELECT DISTINCT users.* 
                     FROM public.users 
                     INNER JOIN public.event_enrollments ON event_enrollment.id_user = users.id
                     LEFT JOIN public.events ON events.id = event_enrollments.id_event
                     LEFT JOIN public.tags ON tags.id = event_tags.id_tag
                     WHERE 1=1`;
    
        if (entity.first_name) {
            conditions.push(`lower(users.name) LIKE lower($${params.length + 1})`);
            params.push(`%${entity.name}%`);
        }
    
        if (entity.last_name) {
            conditions.push(`lower(events.name) LIKE lower($${params.length + 1})`);
            params.push(`%${entity.name}%`);
        }
    
        if (entity.category) {
            conditions.push(`lower(event_categories.name) LIKE lower($${params.length + 1})`);
            params.push(`%${entity.category}%`);
        }
    
        if (entity.startdate) {
            conditions.push(`start_date = $${params.length + 1}`);
            params.push(entity.startdate);
        }
    
        if (conditions.length > 0) {
            query += ` AND ${conditions.join(' AND ')}`;
        }
    
        query += ";";
        console.log(query);
    
        return dbh.requestValues(query, params);
    }
    */
}