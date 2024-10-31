import DBHelper from '../helpers/database-helper.js';
const dbh = new DBHelper();

export default class LocationRepository {
    getAllAsync = async () => {
        return dbh.request('SELECT * FROM locations');
    }

    getByIdAsync = async (id) =>
    {
        return dbh.requestOne('SELECT * FROM locations WHERE ID = $1', [id]);
    }
}
