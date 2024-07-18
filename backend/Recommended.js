const { PrismaClient } = require('@prisma/client');

class Recommended {

    constructor(prisma) {
        this.prisma = prisma;
    }

    /*
    * Takes in user and updates their set of similar users in database based on song ratings
    */
    async updateSimilars(user) {
        try {
            const userRatings = await this.prisma.interactions.findMany({ //get all the rating occurrences a user has made
                where: { user: user }
            });
            const userSongs = userRatings.map(rating => rating.songItem); //get all the songs a user had rated
            const allRatings = await this.prisma.interactions.findMany({ //get all the rating occurrences made by other users for the songs a user has rated
                where: { songItem: { in: userSongs }, NOT: { user } }
            });
            const others = {};
            allRatings.forEach(interaction => { //map the rating for all rating occurrences to the user who made the rating
                if (!others[interaction.user]) {
                    others[interaction.user] = [];
                }
                others[interaction.user].push([interaction.songItem, interaction.rating]);
            });
            const similarities = {};
            for (const [otherUser, ratingData] of Object.entries(others)) { //calculate and map the similarity of each user
                similarities[otherUser] = await this.computePearson(userRatings, ratingData);
            }
            const sortedSimilarities = new Map(
                Object.entries(similarities).sort((user1, user2) => user2[1] - user1[1])
            );
            await this.prisma.user.update({ //update similarity scores in database
                where: { user: user },
                data: { similars: Array.from(sortedSimilarities) }
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
                if (rating.songItem == otherRating[0]) {
                    common[rating.songItem] = { user: rating.rating, other: otherRating[1] }
                    n += 1;
                }
            })
        })
        let sumR = 0; //sum of user ratings
        let sumOR = 0; //sum of other user ratings
        let sumRsq = 0; //sum of squared user ratings
        let sumORsq = 0; //sum of squared other user ratings
        let sumCrossP = 0; //sum of cross products
        Object.entries(common).forEach(([songItem, ratings]) => {
            sumR += ratings.user;
            sumOR += ratings.other;
            sumRsq += ratings.user * ratings.user;
            sumORsq += ratings.other * ratings.other;
            sumCrossP += ratings.user * ratings.other;
        })
        let numerator = (n * sumCrossP) - (sumR * sumOR);
        let denominator = Math.sqrt(((n * sumRsq) - (sumR * sumR))*((n * sumORsq) - (sumOR * sumOR)));
        if (denominator === 0) {
            return 0;
        }
        let pearson = numerator / denominator;
        return pearson;
    }

    /*
    * Get map of top 3 similar users while similarity is still positive
    */
    async getTopSimilars(user) {
        try {
            const curUser = await this.prisma.user.findUnique({
                where: { user: user }
            })
            const similarities = curUser.similars;
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
        const interactions = await this.prisma.interactions.findMany({
            where: { user: user }
        })
        return interactions;
    }

    /*
    * Takes in a user name and array of songs.
    * Returns all ratings a user has made, excluding those where ths song is in the songs array.
    */
    async filteredInteractionsByUser(user, songs) {
        const interactions = await this.prisma.interactions.findMany({
            where: {
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
            const interactions = await this.interactionsByUser(user);
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
    * Get the weighted scores for the songs the top similar users have rated
    */
    async getWeightedScores(user, top3) {
        try {
            const userSongs = await this.songsByUser(user);
            let filteredInteractions = [];
            for (let [otherUser, similarity] of top3) { //filtered interactions is an array of the interactions similar users have made with songs the user has not yet rated
                let newInteractions = await this.filteredInteractionsByUser(otherUser, userSongs);
                filteredInteractions = [...filteredInteractions, ...newInteractions];
            }
            const interactionsMap = new Map(); //turn filtered interactions into a map with key as songs and value as an array of user, rating pairs
            filteredInteractions.forEach(interaction => {
                if (!(interactionsMap.has(interaction.songItem))) {
                    interactionsMap.set(interaction.songItem, []);
                }
                interactionsMap.get(interaction.songItem).push([interaction.user, interaction.rating]);
            })
            let weightedScores = new Map();
            for (let [song, interactions] of interactionsMap) { //calculate the weighted score for each song based on the ratings given by each user and their similarity score
                let sumSimScore = 0;
                let sumWeightedRating = 0;
                for (let interaction of interactions) { //go through each interaction made with song
                    let simScore = top3.get(interaction[0]); //sets the similarity score for the user who made the interaction
                    let rating = interaction[1]; //sets the rating given to the song in the interaction
                    sumWeightedRating += simScore * rating;
                    sumSimScore += simScore;
                }
                let weightedAverage = sumWeightedRating / sumSimScore;
                if (weightedAverage > 5) {
                    weightedScores.set(song, weightedAverage);
                }
            }
            return weightedScores;
        } catch (err) {
            throw err;
        }
    }

    /*
    * Takes weighted scores map, which maps songs to their weighted score.
    * Returns array of songs, order by highest recommendation based on weighted score.
    */
    sortByWeightedScores(weightedScoresMap) {
        const sortedArray = Array.from(weightedScoresMap);
        sortedArray.sort((score1, score2) => score2[1] - score1[1]);
        const sortedSongs = sortedArray.map(song => song[0]);
        return sortedSongs;
    }
}

module.exports = Recommended;