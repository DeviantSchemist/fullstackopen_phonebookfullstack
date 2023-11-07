const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'))

let phonebook = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => {
  const maxId = phonebook.length > 0
  ? Math.max(...phonebook.map(person => person.id))
  : 0

  return maxId + 1;
}

const checkName = name => {
  return phonebook.map(person => person.name).includes(name);
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find(person => person.id === id);
  person ? response.json(person) : response.status(404).end();
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  phonebook = phonebook.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ 
      error: 'no name entered' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'no number entered' 
    })
  }

  if (checkName(body.name)) {
    return response.status(400).json({ 
      error: 'name is already in phonebook' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number || false
  }

  phonebook = phonebook.concat(person);
  response.json(person);
})

app.get('/info', (request, response) => {
  response.send(`<p>Phone has info for ${phonebook.length} people</p> <p>${new Date(Date.now())}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})