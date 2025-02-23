import { Loader } from "@mantine/core";
import React, { useState, Suspense, useContext, useEffect } from "react";
import WikiEntry from "./wikiEntry";
import { useLoaderData, useParams } from "react-router-dom";
import { PageHistoryContext } from "./App";

export async function loadWikiDungenInfo(pageTitle) {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL_PY}\\scrape_wikipedia`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url:
                        "https://en.wikipedia.org/wiki/" + encodeURI(pageTitle),
                }),
            }
        );
        return { pageData: response.json() };
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
    const { pageHistory } = useContext(PageHistoryContext);
    return (
        <div>
            <div>
                {pageHistory.map((value, i) => {
                    return <li key={i}>{value}</li>;
                })}
            </div>
            <Suspense fallback={<HydrateFallback />}>
                <WikiEntry />
            </Suspense>
        </div>
    );
}

export default Game;
