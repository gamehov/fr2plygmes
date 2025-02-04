// This function will return the API key stored in the environment variables
exports.handler = async function(event, context) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        API_KEY: process.env.FREETOGAME_API_KEY // Set this environment variable in Netlify
      }),
    };
  };
  