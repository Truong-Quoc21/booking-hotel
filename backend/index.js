import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config() 
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Serve ảnh tĩnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

import { AppRoute } from './AppRoute.js'
app.get('/', (req, res) => {})

const port = process?.env?.PORT ?? 3000
AppRoute(app)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

/**
npx sequelize-cli db:migrate

npx sequelize-cli db:migrate:undo:all
 
yarn add --dev @babel/core @babel/node @babel/preset-env

 */
