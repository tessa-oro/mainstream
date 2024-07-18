class UserAnalysis {

    constructor(prisma) {
        this.prisma = prisma;
        this.getTranscript(videoId) = require('youtube-transcript-api');
    }

    async textapi(inputText) {
        const fetch = (await import('node-fetch')).default;
        const FormData = require('form-data');
    
        const data = new FormData();
        data.append('text', inputText);
        data.append('language', 'english');
    
        const url = 'https://japerk-text-processing.p.rapidapi.com/sentiment/';
        const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '60caffb22cmsh4549d89b2643826p19684djsncc8300b7fec4',
            'x-rapidapi-host': 'japerk-text-processing.p.rapidapi.com',
            ...data.getHeaders(),
        },
        body: data
        };
    
        try {
            const response = await fetch(url, options);
            const result = await response.text();
            return result;
        } catch (error) {}
    }

}

module.exports = UserAnalysis;