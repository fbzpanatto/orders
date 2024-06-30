"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConn = exports.connectionPool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const config_1 = require("../config");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('process.env.NODE', process.env.NODE_ENV);
exports.connectionPool = promise_1.default.createPool({
    host: 'localhost',
    user: 'fbzpanatto',
    database: process.env.NODE_ENV === 'development' ? 'mydb' : 'mydbTest',
    password: 'fnp181292',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: (0, config_1.config)().db.connectTimeout,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    dateStrings: true
});
async function dbConn() { return await exports.connectionPool.getConnection(); }
exports.dbConn = dbConn;
