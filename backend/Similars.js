const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Similars {

    /*
    * Updates the set of similar users based on song ratings
    */
    async update(user) {
        try {
            const userRatings = await prisma.interactions.findMany({ //get all the rating occurrences a user has made
                where: { user: user }
            });
            const userSongs = userRatings.map(rating => rating.songItem); //get all the songs a user had rated
            const allRatings = await prisma.interactions.findMany({ //get all the rating occurrences made by other users for the songs a user has rated
                where: {songItem: { in: userSongs }, NOT: { user }}
            });
            const others = {};
            allRatings.forEach(interaction => { //map the rating for all rating occurrences to the user who made the rating
                if (!others[interaction.user]) {
                    others[interaction.user] = [];
                }
                others[interaction.user].push(interaction.rating);
            });
            const similarities = {};
            for (const [otherUser, ratings] of Object.entries(others)) { //calculate and map the similarity of each user
                similarities[otherUser] = this.computePearson(userRatings, ratings);
            }
            const sortedSimilarities = new Map(
                Object.entries(similarities).sort((user1, user2) => user2[1] - user1[1])
            );
            const jsonSimilarities = JSON.stringify(Array.from(sortedSimilarities));
            await prisma.user.update({ //update similarity scores in database
                where: { user: user },
                data: { similars: {set: jsonSimilarities}}
            });
            return similarities;
        } catch (err) {
            throw err;
        }
    }

    /*
    * Computes the Pearson Correlation Coefficient for two users based on their ratings of songs
    */
    async computePearson(userRatings, otherRatings) {
        const common = {};
        let n = 0; //number of common ratings
        userRatings.forEach(rating => {
            otherRatings.forEach(otherRating => {
                if (rating.songItem == otherRating.songItem) {
                    common[rating.songItem] = { user: rating.rating, other: otherRating.rating}
                    n += 1;
                }
            })
        })
        let sumR = 0; //sum of user ratings
        let sumOR = 0; //sum of other user ratings
        let sumRsq = 0; //sum of squared user ratings
        let sumORsq = 0; //sum of squared other user ratings
        let sumCrossP = 0; //sum of cross products
        common.forEach((ratings, _) => {
            sumR += ratings.user;
            sumOR += ratings.other;
            sumRsq += ratings.user * ratings.user;
            sumORsq += ratings.other * ratings.other;
            sumCrossP += ratings.user * ratings.other;
        })
        let numerator = (n*sumCrossP)-(sumR * sumOR)
        let denominator = Math.sqrt((n*sumRsq)-(sumR*sumR))((n*sumORsq)-(sumOR*sumOR))
        return numerator / denominator;
    }
}