document.addEventListener("DOMContentLoaded", function () {
    // Fetch the API key from Netlify Function
    fetch("/.netlify/functions/get-api-key")
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch API key");
            return response.json();
        })
        .then(config => {
            const API_KEY = config.API_KEY;
            if (!API_KEY) throw new Error("API key is missing");

            // Initialize the app with the API key
            initApp(API_KEY);
        })
        .catch(error => {
            console.error("Error loading API key:", error);
            document.getElementById("games-container").innerHTML = `<p style="color:red;">Failed to load API key. Please try again later.</p>`;
        });
});

// Initialize the app with the API key
function initApp(API_KEY) {
    window.API_KEY = API_KEY; // Store the API key in a global variable

    // Attach event listeners
    document.getElementById("filter-button").addEventListener("click", fetchGames);
    fetchGames(); // Initial fetch
}

async function fetchGames() {
    if (!window.API_KEY) {
        console.error("API key is not available.");
        return;
    }

    const platform = document.getElementById("platform").value;
    const category = document.getElementById("category").value;
    const sort = document.getElementById("sort").value;

    // Show loading spinner (add a loading element to your HTML if needed)
    document.getElementById("loading").style.display = "block";
    document.getElementById("games-container").innerHTML = "";

    // Build the API URL with filters
    let url = "https://free-to-play-games-database.p.rapidapi.com/api/games";
    const params = [];
    if (platform !== "all") params.push(`platform=${platform}`);
    if (category) params.push(`category=${category}`);
    if (sort) params.push(`sort-by=${sort}`);

    if (params.length) {
        url += "?" + params.join("&");
    }

    console.log("Fetching data from:", url); // Debugging log

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
                "x-rapidapi-key": window.API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        displayGames(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("games-container").innerHTML = `<p style="color:red;">Failed to fetch data. Try again later.</p>`;
    } finally {
        // Hide loading spinner
        document.getElementById("loading").style.display = "none";
    }
}

function displayGames(games) {
    const container = document.getElementById("games-container");
    container.innerHTML = "";

    if (games.length === 0) {
        container.innerHTML = "<p>No games found.</p>";
        return;
    }

    games.forEach(game => {
        const gameCard = document.createElement("div");
        gameCard.classList.add("game-card");

        gameCard.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.title}">
            <h3>${game.title}</h3>
            <p><strong>${game.genre} | ${game.platform}</strong></p>
            <p class="short-description">${game.short_description}</p>
            <button onclick="getSystemRequirements(${game.id})">System Requirements</button>
            <a href="${game.game_url}" target="_blank">
                <button class="play-button">Play Now</button>
            </a>
        `;

        container.appendChild(gameCard);
    });
}

async function getSystemRequirements(gameId) {
    if (!window.API_KEY) {
        console.error("API key is not available.");
        return;
    }

    const url = `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${gameId}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
                "x-rapidapi-key": window.API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const game = await response.json();
        if (game.minimum_system_requirements) {
            const reqs = game.minimum_system_requirements;
            alert(
                `🔧 System Requirements for ${game.title}:\n\n` +
                `🖥️ OS: ${reqs.os}\n` +
                `📥 Storage: ${reqs.storage}\n` +
                `💾 RAM: ${reqs.memory}\n` +
                `🎮 GPU: ${reqs.graphics}\n` +
                `⚡ CPU: ${reqs.processor}`
            );
        } else {
            alert(`No system requirements available for ${game.title}.`);
        }
    } catch (error) {
        console.error("Error fetching system requirements:", error);
        alert("Failed to load system requirements.");
    }
}
