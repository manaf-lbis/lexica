import express from 'express'
import cors from 'cors'
import appRoute from './router/appRoute'

const app = express()

app.use(cors())
app.use(express.json())


app.use('/api', appRoute)




app.listen(3000, () => console.log('Server running on port 3000'));