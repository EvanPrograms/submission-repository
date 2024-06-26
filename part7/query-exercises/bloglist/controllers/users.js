const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1,  title: 1, author: 1, id: 1 })
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const id = request.params.id

  const user = await User
    .findById(id)
    .populate('blogs', { url: 1,  title: 1, author: 1, id: 1 })

  response.json(user)
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3) {
    return response.status(403).send({ error: "Password length is too short"})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User ({
    username,
    passwordHash,
    name
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
  
})

module.exports = usersRouter