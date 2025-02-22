import React, { useState, useEffect } from "react";

function Game() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchWikiPage();
  }, []);

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

  const generateImage = async (query) => {
    try {
      const response = await fetch("YOUR_IMAGE_API_ENDPOINT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `A fantasy dungeon interpretation of ${query}`,
        }),
      });

      const data = await response.json();
      setImageUrl(data.image_url); // Update with actual API response structure
    } catch (error) {
      console.error("Error generating image:", error);
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
