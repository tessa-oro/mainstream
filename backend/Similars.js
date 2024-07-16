const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Similars {

    /*
    * Updates the set of similar users based on song ratings
    */
    async updateSimilars(user) {
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
            await prisma.user.update({ //update similarity scores in database
                where: { user: user },
                data: { similars: {set: Array.from(sortedSimilarities)}}
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

    /*
    * Get map of top 3 similar users while similarity is still positive
    */
    async getTopSimilars(user) {
        try {
            const curUser = await prisma.user.findUnique({
                where : { user: user }
            })
            const similarities = new Map(curUser.similars);
            const top3 = new Map();
            let count = 0;
            for (let [otherUser, similarity] of similarities) {
                if (count === 3 || similarity <= 0) { //break out of loop if already have 3 user or similarity no longer positive
                    break;
                }
                top3.set(otherUser, similarity);
                count++;
            }
            return top3;
        } catch (err) {
            throw err;
        }
    }

    /*
    * Look up ratings made by a user
    */
    async interactionsByUser(user) {
        const interactions = await prisma.interactions.findMany({
            where : { user: user }
        })
        return interactions;
    }

    /*
    * Takes in a user name and array of songs.
    * Returns all ratings a user has made, excluding those where ths song is in the songs array.
    */
    async filteredInteractionsByUser(user, songs) {
        const interactions = await prisma.interactions.findMany({
            where : { 
                user: user,
                songItem: {
                    notIn: songs
                }
             }
        })
        return interactions;
    }

    /*
    * Look up songs rated by a user
    */
    async songsByUser(user) {
        try {
            const interactions = this.interactionsByUser(user);
            let songs = [];
            interactions.forEach((interaction) => {
                songs.push(interaction.songItem);
            })
            return songs;
        } catch (err) {
            throw err;
        }
    }

    
}