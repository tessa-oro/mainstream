const { PrismaClient } = require('@prisma/client');

class Rater {

    constructor (engine) {
        this.prisma = new PrismaClient();
        this.engine = engine;
    }

    /*
    * Adds a new rating to the interactions model
    */
    async add(user, song, rating) {
        try {
            await this.prisma.interactions.create({
                data: {
                    user: user,
                    songItem: song,
                    rating: rating
                }
            })
            await Promise.all([
                this.engine.similars.update(user),
                this.engine.suggestions.update(user)
            ])
        } catch (err) {
            throw err;
        }
    }

    /*
    * Look up songs rated by a user
    */
    async songsByUser(user) {
        try {
            const interactions = await this.prisma.interactions.findMany({
                where : { user: user }
            })
            let songs = [];
            interactions.forEach((interaction) => {
                songs.push(interaction.songItem);
            })
            return songs;
        } catch (err) {
            throw err;
        }
    }

    /*
    * Look up users who have rated an song
    */
    async usersBySong(song) {
        try {
            const interactions = await this.prisma.interactions.findMany({
                where : { songItem: song }
            })
            let users = [];
            interactions.forEach((interaction) => {
                users.push(interaction.user);
            })
            return users;
        } catch (err) {
            throw err;
        }
    }
}