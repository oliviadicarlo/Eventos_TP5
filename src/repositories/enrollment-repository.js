import DBHelper from '../helpers/database-helper.js';
const dbh = new DBHelper();

export default class EnrollmentRepository {

    createAsync = async (entity) =>
    {
        let sql = `INSERT INTO public.event_enrollments(id_event, id_user, description, registration_date_time, attended, observations, rating)
                        VALUES($1, $2, $3, $4, B'0', null, null)`;
        let registration_d_t = new Date();        
        let values = [entity.id_event, entity.id_user, entity.description, registration_d_t];
        return dbh.requestOne(sql, values);
    }

    //devuelve la cantidad de gente anotada para un evento
    countEnrolledAsync = async (id_event) =>{
        let query = 'SELECT COUNT(*) FROM public.event_enrollments WHERE id_event = $1';
        let values = [id_event];
        return dbh.requestOne(query, values);
    }

    getByUserIdAndEventId = async (id_user, id_event) => {
        let query = 'SELECT * FROM public.event_enrollments WHERE id_user = $1 AND id_event = $2';
        let values = [id_user, id_event];
        return dbh.requestOne(query, values);
    }

    deleteByIdAsync = async (id) => //Id del del enrollment
    {
        return dbh.requestOne('DELETE FROM event_enrollments WHERE id = $1', [id])
    }

    getByEventAsync = async (id_event, filtro) => {
        let params = [];
        let conditions = [];
    
        let query = `SELECT users.* 
                     FROM public.users
                     INNER JOIN public.event_enrollments ON users.id = event_enrollments.id_user
                     WHERE event_enrollments.id_event = $1`; // Assuming you want to filter by id_event
        params[0] = id_event;
    
        if (filtro.first_name) {
            conditions.push(`lower(users.first_name) LIKE lower($${params.length + 1})`);
            params.push(`%${filtro.first_name}%`);
        }
        if (filtro.last_name) {
            conditions.push(`lower(users.last_name) LIKE lower($${params.length + 1})`);
            params.push(`%${filtro.last_name}%`);
        }
        if (filtro.username) {
            conditions.push(`lower(users.username) LIKE lower($${params.length + 1})`);
            params.push(`%${filtro.username}%`);
        }
        if (filtro.attended) {
            conditions.push(`event_enrollments.attended = TRUE`);
        }
        if (filtro.rating) {
            conditions.push(`event_enrollments.rating > $${params.length + 1}`);
            params.push(filtro.rating); // Assuming rating is a number
        }
    
        if (conditions.length > 0) {
            query += ` AND ${conditions.join(' AND ')}`;
        }
    
        query += ";";
    
        return dbh.requestValues(query, params);
    }
    
}   