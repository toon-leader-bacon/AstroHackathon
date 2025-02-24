import { Loader } from "@mantine/core";
import React, { Suspense, useContext } from "react";
import WikiEntry from "./WikiEntry";
import { PageHistoryContext } from "./App";
import Loader2 from "./LoadingOverlay"
import { useParams } from "react-router-dom";

async function scrape_wikipedia(pageTitle) {
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
    console.log(pageData);
    return { pageData };
}

export function HydrateFallback() {
    return <Loader className="loader" size="xl" color="blue" type="dots" />;
}

function Game() {
    const { wikipage } = useParams();
    const { pageHistory, isLoading } = useContext(PageHistoryContext);
    return (
        <div>
            <ul className="pageHistoryList">
                {pageHistory.map((value, i) => {
                    return (
                        <React.Fragment key={i}>
                            <li className="pageHistoryListItem">{value}</li>
                            {i < pageHistory.length - 1 && <span>➡️</span>}{" "}
                            {/* Arrow emoji */}
                        </React.Fragment>
                    );
                })}
            </ul>
            {isLoading ? <Loader2 /> : null}
            <Suspense fallback={<HydrateFallback />}>
                <WikiEntry scrapedWikiAndAIImages={scrape_wikipedia(wikipage)} />
            </Suspense>
        </div>
    );
}

export default Game;
