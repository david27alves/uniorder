import 'dotenv/config'
import { Sequelize } from 'sequelize'


const sequelize = new Sequelize({
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    username: process.env.PG_USER,
    password: process.env.PG_PASS,
    dialect: 'postgres',
    logging: false
})

export default sequelize