// .netlify/functions/get-api-key.js
exports.handler = async function(event, context) {
    const API_KEY = process.env.FREETOGAME_API_KEY; // Set your RapidAPI key in the environment variables
    if (!API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "API key is missing in environment variables." })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ API_KEY })
    };
};
