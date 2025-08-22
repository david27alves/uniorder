import 'dotenv/config'
import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER ? process.env.DB_USER : 'postgres',
    password: process.env.DB_PASS ? process.env.DB_PASS : 'postgres',
    dialect: process.env.DB_DIALECT,
    logging: false
})

export default sequelize