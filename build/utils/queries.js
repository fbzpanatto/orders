"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateKey = exports.duplicateKeyUpdate = exports.deleteFromWhere = exports.updateTableSetWhere = exports.update = exports.insertInto = exports.selectAllWithWhere = exports.selectJoinsWhere = exports.selectAllWithWhereLeft = exports.selectAllFrom = exports.selectMaxColumn = void 0;
const mysql2_1 = require("mysql2");
const helper_1 = require("../helper");
const formatDate_1 = require("./formatDate");
const selectMaxColumn = async (conn, table, columnName, maxColumnAlias, whereColumn, whereColumnValue) => {
    const query = `SELECT MAX(${columnName}) as ${maxColumnAlias} FROM ${table} WHERE ${whereColumn} = ?`;
    const [results] = await conn.query(query, [whereColumnValue]);
    const maxColumnResult = results[0];
    const lastColumnID = maxColumnResult[maxColumnAlias] || 0;
    const newColumnId = lastColumnID + 1;
    return newColumnId;
};
exports.selectMaxColumn = selectMaxColumn;
async function selectAllFrom(connection, table, page = 1, paramQuery) {
    const offset = (0, helper_1.getOffset)(page, 10);
    const limit = `LIMIT ${offset},10`;
    let queryString = paramQuery ? `${paramQuery} ${limit}` : `SELECT * FROM ${table} ${limit}`;
    const [results,] = await connection.query((0, mysql2_1.format)(queryString));
    return results;
}
exports.selectAllFrom = selectAllFrom;
const selectAllWithWhereLeft = async (connection, table, whereConditions, joins = []) => {
    const whereClause = Object.keys(whereConditions).length > 0 ? 'WHERE ' + Object.keys(whereConditions).map(key => `${table}.${key}=?`).join(' AND ') : '';
    const joinClause = joins.map(join => `LEFT JOIN ${join.table} ON ${join.on}`).join(' ');
    const queryString = `SELECT * FROM ${table} ${joinClause} ${whereClause}`;
    const values = Object.values(whereConditions);
    const [results] = await connection.query((0, mysql2_1.format)(queryString, values));
    return results;
};
exports.selectAllWithWhereLeft = selectAllWithWhereLeft;
const selectJoinsWhere = async (conn, baseTable, baseAlias, selectFields, whereConditions, joins = []) => {
    const selectClause = selectFields.join(', ');
    const whereClause = Object.keys(whereConditions).length > 0 ? 'WHERE ' + Object.keys(whereConditions).map(key => `${baseAlias}.${key}=?`).join(' AND ') : '';
    const joinClause = joins.map(join => {
        const joinConditions = join.conditions.map(condition => `${condition.column1} = ${condition.column2}`).join(' AND ');
        return `LEFT JOIN ${join.table} AS ${join.alias} ON ${joinConditions}`;
    }).join(' ');
    const queryString = `
    SELECT ${selectClause}
    FROM ${baseTable} AS ${baseAlias}
    ${joinClause}
    ${whereClause}
  `;
    const values = Object.values(whereConditions);
    const [results] = await conn.query((0, mysql2_1.format)(queryString, values));
    return results;
};
exports.selectJoinsWhere = selectJoinsWhere;
const selectAllWithWhere = async (connection, table, whereConditions) => {
    if (Object.keys(whereConditions).length === 0) {
        return;
    }
    const whereClause = Object.keys(whereConditions).map(key => `${key}=?`).join(' AND ');
    const queryString = `SELECT * FROM ${table} WHERE ${whereClause}`;
    const values = Object.values(whereConditions);
    const [results] = await connection.query((0, mysql2_1.format)(queryString, values));
    return results;
};
exports.selectAllWithWhere = selectAllWithWhere;
const insertInto = async (connection, table, body, fieldsToIgnore) => {
    const columns = Object.entries(body)
        .filter(([key]) => !fieldsToIgnore.includes(key))
        .map(([key]) => key);
    const placeholders = columns.map(() => '?');
    const queryString = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;
    const values = Object.values(body).filter((_, index) => !fieldsToIgnore.includes(columns[index]));
    return await connection.query((0, mysql2_1.format)(queryString, values));
};
exports.insertInto = insertInto;
const update = async (conn, table, whereObject, body, ignore) => {
    if (body === undefined) {
        return;
    }
    const columns = Object.entries(body)
        .filter(([key]) => !ignore.includes(key))
        .map(([key, value]) => ({ key, value }));
    const setClause = columns.map(({ key }) => `${key}=?`).join(', ');
    const whereClause = Object.keys(whereObject).map(key => `${key}=?`).join(' AND ');
    const queryString = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    const setValues = columns.map(({ value }) => value);
    const whereValues = Object.values(whereObject);
    const values = [...setValues, ...whereValues];
    const [result] = await conn.query((0, mysql2_1.format)(queryString, values));
    return result;
};
exports.update = update;
const updateTableSetWhere = async (connection, table, column, columnValue, body, fieldsToIgnore) => {
    if (body === undefined) {
        return;
    }
    body.updated_at = (0, formatDate_1.formatDate)(new Date());
    const columns = Object.entries(body)
        .filter(([key]) => !fieldsToIgnore.includes(key))
        .map(([key, value]) => ({ key, value }));
    const queryString = `UPDATE ${table} SET ${columns.map(({ key }) => `${key}=?`).join(', ')} WHERE ${column}=?`;
    const values = [...columns.map(({ value }) => value), columnValue];
    const [result,] = await connection.query((0, mysql2_1.format)(queryString, values));
    return result;
};
exports.updateTableSetWhere = updateTableSetWhere;
const deleteFromWhere = async (connection, table, whereObject) => {
    const whereClause = whereObject.map(({ column }) => `${column} = ?`).join(' AND ');
    const values = whereObject.map(({ value }) => value);
    const queryString = `DELETE FROM ${table} WHERE ${whereClause}`;
    const [result,] = await connection.query((0, mysql2_1.format)(queryString, values));
    return result;
};
exports.deleteFromWhere = deleteFromWhere;
const duplicateKeyUpdate = async (conn, table, arr, key, value) => {
    if (!arr?.length || arr === undefined) {
        return;
    }
    const mappedArr = arr.map((el) => { return { ...el, [key]: value }; });
    const columns = extractKeysFromFirstObject(mappedArr);
    const placeholders = columns.map(() => '?').join(', ');
    const updateClause = columns.map(column => `${column} = VALUES(${column})`).join(', ');
    const update = `${updateClause}, updated_at = VALUES(updated_at)`;
    const values = mappedArr.flatMap(item => columns.map(column => item[column]));
    const queryString = `
  INSERT INTO ${table} (${columns.join(', ')}) 
  VALUES ${mappedArr.map(() => `(${placeholders})`).join(', ')}
  ON DUPLICATE KEY UPDATE ${update};
`;
    const [result,] = await conn.query((0, mysql2_1.format)(queryString, values));
    return result;
};
exports.duplicateKeyUpdate = duplicateKeyUpdate;
const duplicateKey = async (conn, table, arr) => {
    if (!arr?.length || arr === undefined) {
        return;
    }
    const columns = extractKeysFromFirstObject(arr);
    const placeholders = columns.map(() => '?').join(', ');
    const updateClause = columns.map(column => `${column} = VALUES(${column})`).join(', ');
    const update = `${updateClause}, updated_at = VALUES(updated_at)`;
    const values = arr.flatMap(item => columns.map(column => item[column]));
    const queryString = `
  INSERT INTO ${table} (${columns.join(', ')}) 
  VALUES ${arr.map(() => `(${placeholders})`).join(', ')}
  ON DUPLICATE KEY UPDATE ${update};
`;
    const [result,] = await conn.query((0, mysql2_1.format)(queryString, values));
    return result;
};
exports.duplicateKey = duplicateKey;
const extractKeysFromFirstObject = (array) => { return Object.keys(array[0]); };
