import express from 'express'

const app = express()

app.get('/fr.json', (req: any, res: any) => {
    res.send({ "foo": "bar"})
})

app.get('/404', (req: any, res: any) => {
    res.status(404).send("Not found.")
})

app.get('/fr.app.json', (req: any, res: any) => {
    res.send({ "welcome": "Bienvenue"})
})

app.get('/en.app.json', (req: any, res: any) => {
    res.send({ "welcome": "Welcome"})
})

export default app
