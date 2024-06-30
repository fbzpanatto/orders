"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomFields = exports.getSegments = exports.deleteCustomerRelationalItem = exports.updateNormalPerson = exports.updateLegalPerson = exports.createLegalPerson = exports.createNormalPerson = exports.getLegalById = exports.getNormalById = exports.getNormalCustomers = exports.getLegalCustomers = void 0;
const db_1 = require("./db");
const response_1 = require("../utils/response");
const tables_1 = require("../enums/tables");
const queries_1 = require("../utils/queries");
const resources_1 = require("./../enums/resources");
const getLegalCustomers = async (req) => {
    let conn = null;
    const { company_id } = req.query;
    try {
        conn = await (0, db_1.dbConn)();
        const data = await (0, queries_1.selectJoinsWhere)(conn, tables_1.Tables.legal_persons, 'l', ['l.*', 'c.corporate_name AS company_name'], company_id ? { company_id } : {}, [
            {
                table: tables_1.Tables.companies,
                alias: 'c',
                conditions: [
                    { column1: 'l.company_id', column2: 'c.company_id' }
                ]
            }
        ]);
        return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data });
    }
    catch (error) {
        return (0, response_1.objectResponse)(400, 'Não foi possível processar sua solicitação.', {});
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.getLegalCustomers = getLegalCustomers;
const getNormalCustomers = async (req) => {
    let conn = null;
    const { company_id } = req.query;
    try {
        conn = await (0, db_1.dbConn)();
        const data = await (0, queries_1.selectJoinsWhere)(conn, tables_1.Tables.normal_persons, 'l', ['l.*', 'c.corporate_name AS company_name'], company_id ? { company_id } : {}, [
            {
                table: tables_1.Tables.companies,
                alias: 'c',
                conditions: [
                    { column1: 'l.company_id', column2: 'c.company_id' }
                ]
            }
        ]);
        return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data });
    }
    catch (error) {
        return (0, response_1.objectResponse)(400, 'Não foi possível processar sua solicitação.', {});
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.getNormalCustomers = getNormalCustomers;
const getNormalById = async (req) => {
    const { company_id, person_id, custom_fields, segments } = req.query;
    let conn = null;
    let extra = {};
    try {
        conn = await (0, db_1.dbConn)();
        if (custom_fields) {
            extra.custom_fields = await (0, exports.getCustomFields)(conn, parseInt(company_id));
        }
        if (segments) {
            extra.segments = await (0, exports.getSegments)(conn, parseInt(company_id));
        }
        const baseTable = 'persons';
        const baseAlias = 'p';
        const selectFields = [
            'co.company_id as coCompanyId', 'co.social_name as coSocialName', 'co.cnpj as coCnpj', 'co.corporate_name as coCorporateName',
            'c.*', 'c.company_id AS cCompanyId', 'c.person_id AS cPersonId',
            'a.*', 'a.company_id AS aCompanyId', 'a.person_id AS aPersonId',
            'l.*', 'l.company_id AS lCompanyId', 'l.person_id AS lPersonId',
            'p.*', 'p.company_id AS pCompanyId', 'p.person_id AS pPersonId',
            'ps.*', 'ps.company_id AS psCompanyId', 'ps.person_id AS psPersonId',
            'seg.name AS segment_name'
        ];
        const whereConditions = { company_id, person_id };
        const joins = [
            {
                table: tables_1.Tables.person_segments, alias: 'ps',
                conditions: [{ column1: 'p.person_id', column2: 'ps.person_id' }, { column1: 'p.company_id', column2: 'ps.company_id' }]
            },
            {
                table: tables_1.Tables.segments, alias: 'seg',
                conditions: [{ column1: 'ps.company_id', column2: 'seg.company_id' }, { column1: 'ps.segment_id', column2: 'seg.segment_id' }]
            },
            {
                table: tables_1.Tables.companies, alias: 'co',
                conditions: [{ column1: 'p.company_id', column2: 'co.company_id' }]
            },
            {
                table: tables_1.Tables.normal_persons, alias: 'l',
                conditions: [{ column1: 'p.company_id', column2: 'l.company_id' }, { column1: 'p.person_id', column2: 'l.person_id' },]
            },
            {
                table: tables_1.Tables.person_addresses, alias: 'a',
                conditions: [{ column1: 'p.company_id', column2: 'a.company_id' }, { column1: 'p.person_id', column2: 'a.person_id' },]
            },
            {
                table: tables_1.Tables.person_phones, alias: 'c',
                conditions: [{ column1: 'p.company_id', column2: 'c.company_id' }, { column1: 'p.person_id', column2: 'c.person_id' },]
            }
        ];
        const queryResult = await (0, queries_1.selectJoinsWhere)(conn, baseTable, baseAlias, selectFields, whereConditions, joins);
        console.log('queryResult', queryResult);
        return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data: reduceNormalQueryResult(queryResult), meta: { extra } });
    }
    catch (error) {
        return (0, response_1.objectResponse)(400, 'Não foi possível processar a sua solicitação.');
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.getNormalById = getNormalById;
const getLegalById = async (req) => {
    const { company_id, person_id, custom_fields, segments } = req.query;
    let conn = null;
    let extra = {};
    try {
        conn = await (0, db_1.dbConn)();
        if (custom_fields) {
            extra.custom_fields = await (0, exports.getCustomFields)(conn, parseInt(company_id));
        }
        if (segments) {
            extra.segments = await (0, exports.getSegments)(conn, parseInt(company_id));
        }
        const baseTable = 'persons';
        const baseAlias = 'p';
        const selectFields = [
            'co.company_id as coCompanyId', 'co.social_name as coSocialName', 'co.cnpj as coCnpj', 'co.corporate_name as coCorporateName',
            'c.*', 'c.company_id AS cCompanyId', 'c.person_id AS cPersonId',
            'a.*', 'a.company_id AS aCompanyId', 'a.person_id AS aPersonId',
            'l.*', 'l.company_id AS lCompanyId', 'l.person_id AS lPersonId',
            'p.*', 'p.company_id AS pCompanyId', 'p.person_id AS pPersonId',
            'ps.*', 'ps.company_id AS psCompanyId', 'ps.person_id AS psPersonId',
            'seg.name AS segment_name'
        ];
        const whereConditions = { company_id, person_id };
        const joins = [
            {
                table: tables_1.Tables.person_segments, alias: 'ps',
                conditions: [{ column1: 'p.person_id', column2: 'ps.person_id' }, { column1: 'p.company_id', column2: 'ps.company_id' }]
            },
            {
                table: tables_1.Tables.segments, alias: 'seg',
                conditions: [{ column1: 'ps.company_id', column2: 'seg.company_id' }, { column1: 'ps.segment_id', column2: 'seg.segment_id' }]
            },
            {
                table: tables_1.Tables.companies, alias: 'co',
                conditions: [{ column1: 'p.company_id', column2: 'co.company_id' }]
            },
            {
                table: tables_1.Tables.legal_persons, alias: 'l',
                conditions: [{ column1: 'p.company_id', column2: 'l.company_id' }, { column1: 'p.person_id', column2: 'l.person_id' },]
            },
            {
                table: tables_1.Tables.person_addresses, alias: 'a',
                conditions: [{ column1: 'p.company_id', column2: 'a.company_id' }, { column1: 'p.person_id', column2: 'a.person_id' },]
            },
            {
                table: tables_1.Tables.person_phones, alias: 'c',
                conditions: [{ column1: 'p.company_id', column2: 'c.company_id' }, { column1: 'p.person_id', column2: 'c.person_id' },]
            }
        ];
        const queryResult = await (0, queries_1.selectJoinsWhere)(conn, baseTable, baseAlias, selectFields, whereConditions, joins);
        return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data: reduceLegalQueryResult(queryResult), meta: { extra } });
    }
    catch (error) {
        return (0, response_1.objectResponse)(400, 'Não foi possível processar a sua solicitação.');
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.getLegalById = getLegalById;
const reduceNormalQueryResult = (queryResult) => {
    return queryResult.reduce((acc, curr) => {
        if (!acc.customer) {
            acc = {
                company: {
                    company_id: curr.coCompanyId,
                    corporate_name: curr.coCorporateName,
                    social_name: curr.coSocialName,
                    cnpj: curr.coCnpj
                },
                customer: {
                    person_id: curr.lPersonId,
                    company_id: curr.lCompanyId,
                    cpf: curr.cpf,
                    first_name: curr.first_name,
                    middle_name: curr.middle_name,
                    last_name: curr.last_name
                },
                person: {
                    person_id: curr.pPersonId,
                    company_id: curr.pCompanyId,
                    observation: curr.observation,
                    first_field: curr.first_field,
                    second_field: curr.second_field,
                    third_field: curr.third_field
                },
                address: {
                    person_id: curr.aPersonId,
                    company_id: curr.aCompanyId,
                    add_street: curr.add_street,
                    add_number: curr.add_number,
                    add_uf: curr.add_uf,
                    add_zipcode: curr.add_zipcode,
                    add_city: curr.add_city,
                    add_neighborhood: curr.add_neighborhood,
                },
                contacts: [],
                segments: []
            };
        }
        if (!(curr.contact_id === null) && !acc.contacts.some((obj) => obj.contact_id === curr.contact_id)) {
            acc.contacts = [...acc.contacts, { contact_id: curr.contact_id, person_id: curr.cPersonId, company_id: curr.cCompanyId, phone_number: curr.phone_number, contact: curr.contact }];
        }
        if (!(curr.segment_id === null) && !acc.segments.some((obj) => obj.segment_id === curr.segment_id)) {
            acc.segments = [...acc.segments, { segment_id: curr.segment_id, company_id: curr.psCompanyId, person_id: curr.psPersonId, name: curr.segment_name }];
        }
        return acc;
    }, {});
};
const reduceLegalQueryResult = (queryResult) => {
    return queryResult.reduce((acc, curr) => {
        if (!acc.customer) {
            acc = {
                company: {
                    company_id: curr.coCompanyId,
                    corporate_name: curr.coCorporateName,
                    social_name: curr.coSocialName,
                    cnpj: curr.coCnpj
                },
                customer: {
                    person_id: curr.lPersonId,
                    company_id: curr.lCompanyId,
                    cnpj: curr.cnpj,
                    state_registration: curr.state_registration,
                    corporate_name: curr.corporate_name,
                    social_name: curr.social_name,
                },
                person: {
                    person_id: curr.pPersonId,
                    company_id: curr.pCompanyId,
                    observation: curr.observation,
                    first_field: curr.first_field,
                    second_field: curr.second_field,
                    third_field: curr.third_field
                },
                address: {
                    person_id: curr.aPersonId,
                    company_id: curr.aCompanyId,
                    add_street: curr.add_street,
                    add_number: curr.add_number,
                    add_uf: curr.add_uf,
                    add_zipcode: curr.add_zipcode,
                    add_city: curr.add_city,
                    add_neighborhood: curr.add_neighborhood,
                },
                contacts: [],
                segments: []
            };
        }
        if (!(curr.contact_id === null) && !acc.contacts.some((obj) => obj.contact_id === curr.contact_id)) {
            acc.contacts = [...acc.contacts, { contact_id: curr.contact_id, person_id: curr.cPersonId, company_id: curr.cCompanyId, phone_number: curr.phone_number, contact: curr.contact }];
        }
        if (!(curr.segment_id === null) && !acc.segments.some((obj) => obj.segment_id === curr.segment_id)) {
            acc.segments = [...acc.segments, { segment_id: curr.segment_id, company_id: curr.psCompanyId, person_id: curr.psPersonId, name: curr.segment_name }];
        }
        return acc;
    }, {});
};
const createNormalPerson = async (body) => {
    let conn = null;
    try {
        conn = await (0, db_1.dbConn)();
        await conn.beginTransaction();
        const person_id = await (0, queries_1.selectMaxColumn)(conn, tables_1.Tables.persons, 'person_id', 'max_person_id', 'company_id', parseInt(body.person.company_id));
        const contact_id = await (0, queries_1.selectMaxColumn)(conn, tables_1.Tables.person_phones, 'contact_id', 'max_contact_id', 'company_id', parseInt(body.person.company_id));
        const contactsBody = createContacts(body.contacts, person_id, contact_id);
        Promise.all([
            await createPerson(conn, body, person_id),
            await (0, queries_1.insertInto)(conn, tables_1.Tables.normal_persons, { ...body.customer, person_id }, []),
            await (0, queries_1.insertInto)(conn, tables_1.Tables.person_addresses, { ...body.address, person_id }, []),
            await (0, queries_1.duplicateKey)(conn, tables_1.Tables.person_phones, contactsBody)
        ]);
        await conn.commit();
        return (0, response_1.objectResponse)(200, 'Registro criado com sucesso.', { affectedRows: 1 });
    }
    catch (error) {
        return await rollBackCatchBlock(error, conn);
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.createNormalPerson = createNormalPerson;
const createLegalPerson = async (body) => {
    let conn = null;
    try {
        conn = await (0, db_1.dbConn)();
        await conn.beginTransaction();
        const person_id = await (0, queries_1.selectMaxColumn)(conn, tables_1.Tables.persons, 'person_id', 'max_person_id', 'company_id', parseInt(body.person.company_id));
        const contact_id = await (0, queries_1.selectMaxColumn)(conn, tables_1.Tables.person_phones, 'contact_id', 'max_contact_id', 'company_id', parseInt(body.person.company_id));
        Promise.all([
            await createPerson(conn, body, person_id),
            await (0, queries_1.insertInto)(conn, tables_1.Tables.legal_persons, { ...body.customer, person_id }, []),
            await (0, queries_1.insertInto)(conn, tables_1.Tables.person_addresses, { ...body.address, person_id }, []),
            await (0, queries_1.duplicateKey)(conn, tables_1.Tables.person_phones, createContacts(body.contacts, person_id, contact_id))
        ]);
        await conn.commit();
        return (0, response_1.objectResponse)(200, 'Registro criado com sucesso.', { affectedRows: 1 });
    }
    catch (error) {
        return await rollBackCatchBlock(error, conn);
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.createLegalPerson = createLegalPerson;
const updateLegalPerson = async (req) => {
    const { query, body } = req;
    const { company_id, person_id } = query;
    let conn = null;
    try {
        conn = await (0, db_1.dbConn)();
        await conn.beginTransaction();
        const contact_id = await (0, queries_1.selectMaxColumn)(conn, tables_1.Tables.person_phones, 'contact_id', 'max_contact_id', 'company_id', parseInt(company_id));
        const contacts = createContacts(body.contacts, parseInt(person_id), contact_id);
        const segment_id = await (0, queries_1.selectMaxColumn)(conn, tables_1.Tables.segments, 'segment_id', 'max_segment_id', 'company_id', parseInt(company_id));
        const segments = createSegments(body.segments, parseInt(company_id), parseInt(person_id), segment_id);
        const personSegments = segments?.map(s => { return { company_id, person_id, segment_id: s.segment_id }; });
        await Promise.all([
            (0, queries_1.update)(conn, tables_1.Tables.legal_persons, { company_id, person_id }, body.customer, []),
            (0, queries_1.update)(conn, tables_1.Tables.person_addresses, { company_id, person_id }, body.address, []),
            (0, queries_1.update)(conn, tables_1.Tables.persons, { company_id, person_id }, body.person, []),
            (0, queries_1.duplicateKey)(conn, tables_1.Tables.person_phones, contacts),
            (0, queries_1.duplicateKey)(conn, tables_1.Tables.segments, segments),
            (0, queries_1.duplicateKey)(conn, tables_1.Tables.person_segments, personSegments)
        ]);
        await conn.commit();
        return (0, response_1.objectResponse)(200, 'Registro atualizado com sucesso.', { affectedRows: 1 });
    }
    catch (error) {
        return await rollBackCatchBlock(error, conn);
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.updateLegalPerson = updateLegalPerson;
const updateNormalPerson = async (req) => {
    const { query, body } = req;
    const { company_id, person_id } = query;
    let conn = null;
    try {
        conn = await (0, db_1.dbConn)();
        await conn.beginTransaction();
        const contact_id = await (0, queries_1.selectMaxColumn)(conn, tables_1.Tables.person_phones, 'contact_id', 'max_contact_id', 'company_id', parseInt(company_id));
        const contacts = createContacts(body.contacts, parseInt(person_id), contact_id);
        const segment_id = await (0, queries_1.selectMaxColumn)(conn, tables_1.Tables.segments, 'segment_id', 'max_segment_id', 'company_id', parseInt(company_id));
        const segments = createSegments(body.segments, parseInt(company_id), parseInt(person_id), segment_id);
        const personSegments = segments?.map(s => { return { company_id, person_id, segment_id: s.segment_id }; });
        await Promise.all([
            (0, queries_1.update)(conn, tables_1.Tables.normal_persons, { company_id, person_id }, body.customer, []),
            (0, queries_1.update)(conn, tables_1.Tables.person_addresses, { company_id, person_id }, body.address, []),
            (0, queries_1.update)(conn, tables_1.Tables.persons, { company_id, person_id }, body.person, []),
            (0, queries_1.duplicateKey)(conn, tables_1.Tables.person_phones, contacts),
            (0, queries_1.duplicateKey)(conn, tables_1.Tables.segments, segments),
            (0, queries_1.duplicateKey)(conn, tables_1.Tables.person_segments, personSegments)
        ]);
        await conn.commit();
        return (0, response_1.objectResponse)(200, 'Registro atualizado com sucesso.', { affectedRows: 1 });
    }
    catch (error) {
        return await rollBackCatchBlock(error, conn);
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.updateNormalPerson = updateNormalPerson;
const deleteCustomerRelationalItem = async (req) => {
    let conn = null;
    let result = null;
    const { company_id, person_id, contact_id, segment_id } = req.query;
    try {
        conn = await (0, db_1.dbConn)();
        if (!isNaN(parseInt(company_id)) && !isNaN(parseInt(person_id)) && !isNaN(parseInt(contact_id))) {
            result = await (0, queries_1.deleteFromWhere)(conn, tables_1.Tables.person_phones, [{ column: 'contact_id', value: parseInt(contact_id) }, { column: 'person_id', value: parseInt(person_id) }, { column: 'company_id', value: parseInt(company_id) }]);
        }
        if (!isNaN(parseInt(company_id)) && !isNaN(parseInt(person_id)) && !isNaN(parseInt(segment_id))) {
            result = await (0, queries_1.deleteFromWhere)(conn, tables_1.Tables.person_segments, [{ column: 'segment_id', value: parseInt(segment_id) }, { column: 'person_id', value: parseInt(person_id) }, { column: 'company_id', value: parseInt(company_id) }]);
        }
        return (0, response_1.objectResponse)(200, 'Registro Deletado com sucesso', { affectedRows: result?.affectedRows });
    }
    catch (error) {
        return (0, response_1.objectResponse)(400, 'Não foi possível processar a sua solicitação.');
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.deleteCustomerRelationalItem = deleteCustomerRelationalItem;
const createPerson = async (connection, body, person_id) => {
    const sql = `
    INSERT INTO persons (observation, first_field, second_field, third_field, company_id, person_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
    const values = [body.person.observation, body.person.first_field, body.person.second_field, body.person.third_field, body.person.company_id, person_id];
    await connection.query(sql, values);
};
const createContacts = (body, person_id, contact_id) => {
    if (!body?.length) {
        return [];
    }
    return body.map((c) => {
        if (c.contact_id && c.contact_id != null && c.contact_id != '' && c.contact_id != undefined) {
            return c;
        }
        const newContact = { person_id, contact_id, company_id: c.company_id, phone_number: c.phone_number, contact: c.contact };
        contact_id += 1;
        return newContact;
    });
};
const createSegments = (body, company_id, person_id, segment_id) => {
    if (!body?.length) {
        return [];
    }
    return body.map((seg) => {
        if (seg.segment_id && seg.segment_id != null && seg.segment_id != '' && seg.segment_id != undefined) {
            return { company_id: seg.company_id, segment_id: seg.segment_id, name: seg.segment };
        }
        const newSegment = { company_id, segment_id, name: seg.segment };
        segment_id += 1;
        return newSegment;
    });
};
const getSegments = async (conn, company_id) => { return await (0, queries_1.selectJoinsWhere)(conn, tables_1.Tables.segments, 's', ['s.company_id', 's.segment_id', 's.name'], { company_id }); };
exports.getSegments = getSegments;
const getCustomFields = async (conn, company_id) => {
    const baseTable = 'fields';
    const baseAlias = 'f';
    const selectFields = ['f.*'];
    const whereConditions = { company_id };
    const joins = [];
    return (await (0, queries_1.selectJoinsWhere)(conn, baseTable, baseAlias, selectFields, whereConditions, joins))
        .map((row) => {
        return {
            id: row.field_id,
            table: resources_1.CONFIGURABLE_RESOURCES_AND_FIELDS.find(table => table.id === row.table_id)?.label,
            field: resources_1.CONFIGURABLE_RESOURCES_AND_FIELDS.find(table => table.id === row.table_id)?.fields.find(fl => fl.id === row.field_id)?.field, label: row.label
        };
    });
};
exports.getCustomFields = getCustomFields;
const rollBackCatchBlock = async (error, connection) => {
    if (connection)
        await connection.rollback();
    return (0, response_1.objectResponse)(400, 'Não foi possível processar a sua solicitação.');
};
