// functions/get-api-key.js
exports.handler = async (event, context) => {
    return {
      statusCode: 200,
      body: JSON.stringify({
        API_KEY: process.env.FREETOGAME_API_KEY, // Ensure this matches the environment variable name
      }),
    };
  };
