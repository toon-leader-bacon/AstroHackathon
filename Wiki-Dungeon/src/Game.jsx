import { Loader } from "@mantine/core";
import React, { useState } from "react";
<<<<<<< HEAD
import WikiEntry from "./wikiEntry";
=======
import { useLoaderData } from "react-router-dom";
>>>>>>> 16f1c00dd9a7184a81b4577a991ee54c3a3fd4eb

export async function loadWikiDungenInfo(pageTitle) {
    try {
        const response = await fetch(
            "https://en.wikipedia.org/wiki/" + encodeURI(pageTitle)
        );
        const page = await response.body();
        console.log(page)
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
<<<<<<< HEAD
            <div>
                <WikiEntry />
            </div>
=======
            <div id="pageHistory">
                {pageHistory.map((value, i) => {
                    return <li key={i}>{value}</li>;
                })}
            </div>
            <h1>Asdfadsfdasf</h1>
>>>>>>> 16f1c00dd9a7184a81b4577a991ee54c3a3fd4eb
        </div>
    );
}

export default Game;
