import React, { useContext } from "react";
import WikiEntry from "./wikiEntry";
import { PageHistoryContext } from "./App";
import { useParams } from "react-router-dom";
import Loadable from "./Loadable";

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
    return { pageData };
}

const LoadableWikiEntry = Loadable(WikiEntry)

function Game() {
    const { wikipage } = useParams();
    const { pageHistory } = useContext(PageHistoryContext);
    return (
        <div>
            <ul className="pageHistoryList">
                {pageHistory.map((value, i) => {
                    return (
                        <React.Fragment key={i}>
                            <li className="pageHistoryListItem">{value}</li>
                            {i < pageHistory.length - 1 && <span>➡️</span>}{" "}
                        </React.Fragment>
                    );
                })}
            </ul>
            <LoadableWikiEntry scrapedWikiAndAIImages={scrape_wikipedia(wikipage)} />
        </div>
    );
}

export default Game;
