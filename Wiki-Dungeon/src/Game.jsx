import { Loader } from "@mantine/core";
import React, { useState } from "react";
import WikiEntry from "./wikiEntry";
import { useLoaderData } from "react-router-dom";

export async function loadWikiDungenInfo(pageTitle) {
    try {
        const response = await fetch(
            "https://en.wikipedia.org/wiki/" + encodeURI(pageTitle)
        );
        const page = await response.body();
        console.log(page);
        return page;
    } catch (error) {
        console.error("Error fetching Wikipedia page:", error);
        return null;
    }
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
    return <Loader color="blue" type="dots" />;
}

function Game() {
    const loaderData = useLoaderData();
    const [pageHistory, setPageHistory] = useState([loaderData]);

    return (
        <div>
            <div>
                {pageHistory.map((value, i) => {
                    return <li key={i}></li>;
                })}
            </div>
            <div>
                <WikiEntry />
            </div>
        </div>
    );
}

export default Game;
