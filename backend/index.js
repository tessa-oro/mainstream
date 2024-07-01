const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors());

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany()
    res.status(200).json(users)
})

app.post('/create', async (req, res) => {
    const { user, password } = req.body;
    const newUser = await prisma.user.create({
      data: {
        user,
        password
      }
    })
    res.status(200).json({});
})

app.post("/login", async (req, res) => {
    const { user, password } = req.body;
    const userRecord = await prisma.user.findUnique({
        where : { user }
    })
    if (userRecord.password === password) {
        res.status(200).json({});
    } else {
        res.status(500).json({error: "error with login"});
    }
})

app.post('/songs/:user/create/', async (req, res) => {
    const { user } = req.params
    const { title, player } = req.body
    const newSong = await prisma.song.create({
      data: {
        title,
        player,
        artist : "placeholder",
        userID : user
      }
    })
    res.json(newSong)
})

app.post('/follow', async (req, res) => {
    const { follower, following } = req.body;
    const newRelation = await prisma.relationship.create({
      data: {
        follower,
        following
      }
    })
    res.status(200).json({});
})

app.get('/following/:user', async (req, res) => {
    const { user } = req.params
    try {
      const relationships = await prisma.relationship.findMany({
        where: { follower : user 
        }
      });
      res.status(200).json(relationships);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching the posts." });
    }
})

app.listen(port, () => {
    console.log(`starting on port: ${port}`);
})