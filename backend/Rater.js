const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Rater {

    constructor (engine) {
        this.engine = engine;
    }

    /*
    * Adds a new rating to the interactions model
    */
    async add(user, song, rating) {
        try {
            await prisma.interactions.create({
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
    * Look up users who have rated an song
    */
    async usersBySong(song) {
        try {
            const interactions = await prisma.interactions.findMany({
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