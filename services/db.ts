import { Dialect, Sequelize } from "sequelize"
import pg from "pg"

const sequelize = new Sequelize({
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    dialect: process.env.DB_DIALECT as Dialect,
    logging: false,
    dialectModule: pg
}) 

export default sequelize