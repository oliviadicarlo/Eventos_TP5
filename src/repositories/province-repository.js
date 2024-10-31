import DBConfig from './../configs/dbConfig.js';
import DBHelper from '../helpers/database-helper.js';
import pkg from 'pg';
const dbh = new DBHelper();
const {Client} = pkg;

export default class ProvinceRepository {
    getAllAsync = async () => {
        let returnArray = null;
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `SELECT * FROM provinces`;
            const result = await client.query(sql);
            await client.end();
            returnArray = result.rows;
        }
        catch (error){
            console.log("error", error);
        }
        return returnArray;
    }

    getByIdAsync = async (id) =>
    {
        let province = null;
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `SELECT * FROM provinces WHERE ID = $1`;
            const values = [id];
            const result = await client.query(sql, values);
            await client.end();
            province = result.rows;
        }
        catch (error){
            console.log(error);
        }
        return province;
    }

    createAsync = async (entity) =>
    {
        let created = false;
        const client = new Client(DBConfig);
        let sql, values;
        try {
            await client.connect();
            if(!entity.id)
            {
                sql = `INSERT INTO provinces
                                (name, full_name, latitude, longitude, display_order)
                            VALUES
                                ($1,$2,$3,$4,$5)`;
                values = [entity.name, entity.full_name, entity.latitude, entity.longitude, entity.display_order];
            }
            else
            {
                sql = `INSERT INTO provinces
                                (id, name, full_name, latitude, longitude, display_order)
                            VALUES
                                ($1,$2,$3,$4,$5,$6)`;
                values = [entity.id, entity.name, entity.full_name, entity.latitude, entity.longitude, entity.display_order];
            }
            await client.query(sql, values);
            await client.end();
            created = true;
        }
        catch (error){
            console.error(error);
        }
        return created;
    }

    updateAsync = async (entity) => {
        let returnArray = null;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = 'UPDATE provinces SET name = $1, full_name = $2, latitude = $3, longitude = $4, display_order = $5 WHERE id = $6';
            let values = [entity.name, entity.full_name, entity.latitude, entity.longitude, entity.display_order, entity.id];
            const result = await client.query(sql, values);
            await client.end();
            returnArray = result.rows;
        }
        catch (error){
            console.log(error);
        }

        return returnArray;
    }

    deleteByIdAsync = async (id) => 
    {
        let deleted = false;
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = 'DELETE FROM provinces WHERE id = $1';
            const values = [id];
            await client.query(sql, values);
            await client.end();
            deleted = true;
        }
        catch (error){
            console.log(error);
        }
        return deleted;
    }

    getLocationsAsync = async (id) => 
    {
         let returnValue =  await dbh.requestValues('SELECT * FROM locations WHERE id_province = $1', [id]);
         return returnValue;
    }
}