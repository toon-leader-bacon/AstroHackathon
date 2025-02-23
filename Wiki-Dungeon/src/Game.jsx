import { Loader } from "@mantine/core";
import React, { useState, Suspense, useContext, useEffect } from "react";
import WikiEntry from "./wikiEntry";
import { useLoaderData, useParams } from "react-router-dom";
import { PageHistoryContext } from "./App";

async function scrape_wikipedia_promis(pageTitle) {
    const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_PY}\\scrape_wikipedia`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: "https://en.wikipedia.org/wiki/" + encodeURI(pageTitle),
            }),
        }
    );
    const pageData = await response.json();
    console.log(pageData)
    return { pageData };
}

export async function loadWikiDungenInfo(pageTitle) {
    return { pageDataGetter: scrape_wikipedia_promis(pageTitle) };
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
    return <Loader color="blue" type="dots" />;
}

function Game() {
    const { pageHistory } = useContext(PageHistoryContext);
    return (
        <div>
            <ul className="pageHistoryList">
                {pageHistory.map((value, i) => {
                    return (
                        <li className="pageHistoryListItem" key={i}>
                            {value}
                        </li>
                    );
                })}
            </ul>
            <Suspense fallback={<HydrateFallback />}>
                <WikiEntry />
            </Suspense>
        </div>
    );
}

export default Game;
