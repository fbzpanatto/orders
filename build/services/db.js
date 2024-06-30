"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConn = exports.connectionPool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.connectionPool = promise_1.default.createPool({
    host: 'localhost',
    user: 'fbzpanatto',
    // database: process.env.NODE_ENV === 'development' ? 'mydb' : 'mydbTest',
    database: 'mydb',
    password: 'fnp181292',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    dateStrings: true
});
async function dbConn() { return await exports.connectionPool.getConnection(); }
exports.dbConn = dbConn;
