import React, { useState } from "react";

export async function loadWikiDungenInfo({ params }) {
    try {
        const response = await fetch(
            "https://en.wikipedia.org/api/rest_v1/page/random/summary"
        );
        const page = await response.json();
        return page
    } catch (error) {
        console.error("Error fetching Wikipedia page:", error);
        return null;
    }
}

function Game() {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const fetchWikiPage = async () => {
        try {
            const response = await fetch(
                "https://en.wikipedia.org/api/rest_v1/page/random/summary"
            );
            const page = await response.json();

            setTitle(page.title);
            setSummary(page.extract);

            // Generate an AI image based on the title
            generateImage(page.title);
        } catch (error) {
            console.error("Error fetching Wikipedia page:", error);
        }
    };

    return (
        <div>
            <h1>{title}</h1>
            {imageUrl && <img src={imageUrl} alt={title} />}
            <p>{summary}</p>
            <button onClick={fetchWikiPage}>Explore Next Dungeon</button>
        </div>
    );
}

export default Game;
