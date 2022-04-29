require('dotenv').config()

const express = require("express")
const app = express()
let cors = require('cors')
const path = require("path");

app.use(express.json())
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(cors())

const {Sequelize} = require("sequelize");


app.use('/adventures', require('./routes/adventures'))

const dbClient = new Sequelize (process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_URL,
    dialect: "postgres"
});

const Adventures = require("./schemas/adventure")(dbClient)
const Countries = require("./schemas/country")(dbClient)
const CountryVisits = require("./schemas/country_visits")(dbClient)
const Posts = require("./schemas/post")(dbClient)

Adventures.belongsToMany(Countries, {through: CountryVisits})
Countries.belongsToMany(Adventures, {through: CountryVisits})

Adventures.hasMany(Posts)

dbClient.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(error => console.error('Unable to connect to the database:', error))

dbClient.sync().then(() => {
    app.listen(3002, async () => {
        console.log('Obama is watching')
    })
}).catch(err => {
    console.log(err)
})

module.exports = {
    Adventures,
    Countries,
    Posts
}