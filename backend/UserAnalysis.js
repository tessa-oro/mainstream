class UserAnalysis {

    constructor(prisma) {
        this.prisma = prisma;
    }

    async textapi(inputText) {
        const fetch = (await import('node-fetch')).default;
        const FormData = require('form-data');
        require('dotenv').config();
    
        const data = new FormData();
        data.append('text', inputText);
    
        const url = 'https://twinword-emotion-analysis-v1.p.rapidapi.com/analyze/';
        const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_KEY,
            'x-rapidapi-host': 'twinword-emotion-analysis-v1.p.rapidapi.com',
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

    async convertTranscript(videoId) {
        try {
            const { getTranscript } = require('youtube-transcript-api');
            const transcript = await getTranscript(videoId);
            let transcriptString = "";
            transcript.forEach(line => {
                transcriptString += line.text.replace(/♪/g, '');
            })
            return transcriptString;
        } catch (error) {}
    }
}

module.exports = UserAnalysis;