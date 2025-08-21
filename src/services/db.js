import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
    database: 'opcao',
    username: 'postgres',
    password: 'postgres',
    dialect: 'postgres',
    logging: false
})

export default sequelize