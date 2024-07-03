const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 14;
const app = express();
const port = 3000;
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany()
    res.status(200).json(users)
})

app.post('/create', async (req, res) => {
    const { user, password } = req.body;
    bcrypt.hash(password, saltRounds, async function(err, hashed) {
        try {
            await prisma.user.create({
                data: {
                    user,
                    hashedPassword: hashed
                }
            })
            res.status(200).json({});
        } catch (e) {
            res.status(500).json({"error": e.message});
        }
    })
})

app.post("/login", async (req, res) => {
    const { user, password } = req.body;
    const userRecord = await prisma.user.findUnique({
        where : { user }
    })
    bcrypt.compare(password, userRecord.hashedPassword, function(err, result) {
        if (result) {
            res.status(200).json({});
        } else {
            res.status(500).json({"error": err})
        }
    })
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

app.get('/songs/:user/', async (req, res) => {
    const { user } = req.params
    try {
      const songs = await prisma.song.findMany({
        where: { userID : user
        }
      });
      res.status(200).json(songs);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching the songs." });
    }
})

//adding to someone else's follower list
app.post('/follower/:user', async (req, res) => {
    try {
        const { user } = req.params;
        const { name } = req.body;
        const newFollower = await prisma.follower.create({
            data: {
                followsName : user,
                name
            }
        })
        res.status(200).json(newFollower);
    } catch (error) {
        res.status(500).json({ error: "An unexpected error occurred." });
    }
})

//adding to own following list
app.post('/following/:user', async (req, res) => {
    try {
        const { user } = req.params;
        const { name } = req.body;
        const newFollowing = await prisma.following.create({
            data: {
                followedByName : user,
                name,
            }
        })
        res.status(200).json(newFollowing);
    } catch (error) {
        if (error.code === 'P2002') {
            res.status(500).json({ error: "Already following user." });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
})

//get user's followers
app.get('/followers/:user', async (req, res) => {
    const { user } = req.params
    try {
        const followers = await prisma.follower.findMany({
          where: { followsName : user 
          }
        });
        res.status(200).json(followers);
      } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching followers." });
      }
})

//get user's following
app.get('/following/:user', async (req, res) => {
    const { user } = req.params
    try {
      const following = await prisma.following.findMany({
        where: { followedByName : user 
        }
      });
      res.status(200).json(following);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching following." });
    }
})

app.get('/users/:searchUser', async (req, res) => {
    const { searchUser } = req.params
    try {
      const userList = await prisma.user.findMany({
        where: { user: {
                contains: searchUser,
                mode: 'insensitive'
            } 
        }
      });
      const listNames = [];
      userList.forEach((name) => {
        listNames.push(name.user);
      })
      res.status(200).json(listNames);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching following." });
    }
  })

app.listen(port, () => {
    console.log(`starting on port: ${port}`);
})