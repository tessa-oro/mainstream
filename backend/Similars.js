const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Similars {

    async update(user) {
        try {
            const userRatings = await prisma.interactions.findMany({
                where: { user: user }
            });
            const userSongs = userRatings.map(rating => rating.songItem);
            const allRatings = await prisma.interactions.findMany({
                where: {songItem: { in: userSongs }, NOT: { user }}
            });
            const others = {};
            allRatings.forEach(interaction => {
                if (!others[interaction.user]) {
                    others[interaction.user] = [];
                }
                others[interaction.user].push(interaction.rating);
            });
            const similarities = {};
            for (const [otherUser, ratings] of Object.entries(others)) {
                similarities[otherUser] = this.computePearson(userSongs, ratings);
            }
            await prisma.user.update({
                where: { user: user },
                data: { similars: {set: similarities}}
            });
            return similarities;
        } catch (err) {
            throw err;
        }
    }

    async computePearson(userRatings, otherRatings) {

    }
}