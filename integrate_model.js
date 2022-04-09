const express = require('express')
const { spawn } = require('child_process');
const app = express()
const port = 4547

app.get('/', async (req, res) => {
    try {
        console.log("get request received!!")
        const pythonModel = spawn('python', ['tsforecasting.py'])
        pythonModel.stdout.on('data', (data) => {
            console.log(data)
            data = data.toString()
            console.log("converted data to string!!")
            jsonData = JSON.parse(data)
            console.log(jsonData)
            res.json(jsonData)
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

app.listen(port, () => {
    console.log("ML model online on port 4547")
})