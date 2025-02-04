document.addEventListener("DOMContentLoaded", function() {
    fetch("/.netlify/functions/get-api-key")
        .then(response => response.json())
        .then(config => {
            const API_KEY = config.API_KEY;
            fetchGames(API_KEY);
        })
        .catch(error => console.error("Error loading API key:", error));
});

function fetchGames(API_KEY) {
    const platform = document.getElementById("platform").value;
    const category = document.getElementById("category").value;
    const sort = document.getElementById("sort").value;

    let url = "https://free-to-play-games-database.p.rapidapi.com/api/games";

    // Apply filters dynamically
    const params = [];
    if (platform !== "all") params.push(`platform=${platform}`);
    if (category) params.push(`category=${category}`);
    if (sort) params.push(`sort-by=${sort}`);

    if (params.length) {
        url += "?" + params.join("&");
    }

    console.log("Fetching data from:", url); // Debugging log

    fetch(url, {
        method: "GET",
        headers: {
            "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
            "x-rapidapi-key": API_KEY
        }
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then(data => displayGames(data))
    .catch(error => {
        console.error("Error fetching data:", error);
        document.getElementById("games-container").innerHTML = `<p style="color:red;">Failed to fetch data. Try again later.</p>`;
    });
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
            <button onclick="getSystemRequirements(${game.id}, '${API_KEY}')">System Requirements</button>
            <a href="${game.game_url}" target="_blank">
                <button class="play-button">Play Now</button>
            </a>
        `;

        container.appendChild(gameCard);
    });
}

function getSystemRequirements(gameId, API_KEY) {
    const url = `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${gameId}`;

    fetch(url, {
        method: "GET",
        headers: {
            "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
            "x-rapidapi-key": API_KEY
        }
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then(game => {
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
    })
    .catch(error => {
        console.error("Error fetching system requirements:", error);
        alert("Failed to load system requirements.");
    });
}
