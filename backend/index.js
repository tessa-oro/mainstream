const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Recommended = require('./Recommended');
const recommended = new Recommended(prisma);
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
}))

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
})

//create a user
app.post('/create', async (req, res) => {
    const { user, password } = req.body;
    bcrypt.hash(password, saltRounds, async function (err, hashed) {
        try {
            await prisma.user.create({
                data: {
                    user,
                    hashedPassword: hashed,
                    score: 0,
                    numRatedSongs: 0,
                    similars: {},
                    recommended: []
                }
            })
            res.status(200).json({});
        } catch (e) {
            res.status(500).json({ "error": e.message });
        }
    })
})

//authenticate a user
app.post("/login", async (req, res) => {
    const { user, password } = req.body;
    const userRecord = await prisma.user.findUnique({
        where: { user }
    })
    bcrypt.compare(password, userRecord.hashedPassword, function (err, result) {
        if (result) {
            res.status(200).json({});
        } else {
            res.status(500).json({ "error": err })
        }
    })
})

//add a song to user playlist
app.post('/songs/:user/create/', async (req, res) => {
    const { user } = req.params;
    const { title, player } = req.body;
    const newSong = await prisma.song.create({
        data: {
            title,
            player,
            artist: "placeholder",
            avgRating: 0,
            userID: user
        }
    })
    res.json(newSong)
})

//create a song item
app.post('/songItem', async (req, res) => {
        const { playerID } = req.body;
        const newSong = await prisma.songItem.create({
            data: {
                playerID
            }
        })
        res.json(newSong)
})

//get a user playlist
app.get('/songs/:user/', async (req, res) => {
    const { user } = req.params;
    try {
        const songs = await prisma.song.findMany({
            where: {
                userID: user
            },
            orderBy: {
                id: 'desc'
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
                followsName: user,
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
                followedByName: user,
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
    const { user } = req.params;
    try {
        const followers = await prisma.follower.findMany({
            where: {
                followsName: user
            }
        });
        res.status(200).json(followers);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching followers." });
    }
})

//get user's following
app.get('/following/:user', async (req, res) => {
    const { user } = req.params;
    try {
        const following = await prisma.following.findMany({
            where: {
                followedByName: user
            }
        });
        res.status(200).json(following);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching following." });
    }
})

//search for a user by username
app.get('/users/:searchUser', async (req, res) => {
    const { searchUser } = req.params;
    try {
        const userList = await prisma.user.findMany({
            where: {
                user: {
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
        res.status(500).json({ error: "An error occurred while fetching search results." });
    }
})

//get a user's score
app.get('/user/:userId/score', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                user: userId
            }
        });
        res.status(200).json(user.score);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching user score." });
    }
})

//get the songs a user has rated
app.get('/song/ratedBy/:songId', async (req, res) => {
    const { songId } = req.params;
    try {
        const song = await prisma.song.findUnique({
            where: { id: parseInt(songId) }
        });
        res.status(200).json(song.ratedBy);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching rated by." });
    }
})

//add a new rating to a song and update the user score
app.patch('/song/rate/:userId/:by/:id/:num', async (req, res) => {
    const { userId, by, id, num } = req.params;
    try {
        const song = await prisma.song.findUnique({
            where: { id: parseInt(id) }
        });
        if (!song) {
            return res.status(404).json({ error: "Song not found" });
        }
        const addRating = [...song.ratings, parseInt(num)];
        const addRatedBy = [...song.ratedBy, by];
        const newAvg = updateAverage(song.avgRating, song.ratings.length, num);
        const updatedSong = await prisma.song.update({
            where: { id: parseInt(id) },
            data: {
                ratings: addRating,
                ratedBy: addRatedBy,
                avgRating: newAvg
            }
        })
        const user = await prisma.user.findUnique({
            where: { user: userId },
            include: { playlist: true }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const newScore = updateUserScore(user);
        const updatedUser = await prisma.user.update({
            where: { user: userId },
            data: {
                score: newScore
            }
        })
        res.status(200).json([updatedSong, updatedUser]);
    } catch (error) {
        res.status(500).json({ error: "could not rate song" });
    }
})

//create a new interaction
app.post('/interaction', async (req, res) => {
    
        const { user, songItem, rating } = req.body;
        const newInteraction = await prisma.interactions.create({
            data: {
                user, 
                songItem, 
                rating
            }
        })
        res.status(200).json(newInteraction);
})

//calculate the average rating for a song
const updateAverage = (currAvg, currNumEntries, newEntry) => {
    const currTotal = (currAvg * currNumEntries);
    const newLength = currNumEntries + 1;
    const newAvg = ((parseInt(currTotal) + parseInt(newEntry)) / newLength).toFixed(2);
    return newAvg;
}

//calculate the user score
const updateUserScore = (user) => {
    let total = 0;
    let count = 0;
    user.playlist.forEach((song) => {
        if (song.avgRating != 0) {
            total += parseInt(song.avgRating);
            count += 1;
        }
    })
    let score = (total / count).toFixed(1);
    return (score);
}

//update the recommended songs for a user
app.patch('/recommended/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        recommended.updateSimilars(userId);
        const top3 = recommended.getTopSimilars(userId);
        const weightedScoresMap = recommended.getWeightedScores(top3);
        const songsToRecommend = recommended.sortByWeightedScores(weightedScoresMap);
        const updatedUser = await prisma.user.update({
            where: { user: userId },
            data: {
                recommended: songsToRecommend
            }
        })
        res.json(songsToRecommend);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while updating recommended songs." })
    }
})

//get the recommended songs for a user
app.get('/recommended/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { user: userId }
        });
        res.status(200).json(user.recommended);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching recommended songs." });
    }
})

app.listen(port, () => {
    console.log(`starting on port: ${port}`);
})