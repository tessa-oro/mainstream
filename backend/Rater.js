const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Rater {

    async add(user, song, rating) {
        try {
            await prisma.interactions.create({
                data: {
                    user: user,
                    songItem: song,
                    rating: rating
                }
        })} catch (err) {
            throw err;
        }
    }
}