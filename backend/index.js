const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();

app.use(express.json());

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany()
    res.status(200).json(users)
})

app.post('/create', async (req, res) => {
    const { username, password } = req.body;
    const newUser = await prisma.user.create({
      data: {
        username,
        password
      }
    })
    res.status(200).json({});
})

app.listen(port, () => {
    console.log(`starting on port: ${port}`);
})