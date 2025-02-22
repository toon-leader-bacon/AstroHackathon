import { Loader } from "@mantine/core";
import React, { useState } from "react";

export async function loadWikiDungenInfo(pageTitle) {
    console.log(pageTitle)
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

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <Loader color="blue" type="dots" />;
}

function Game({
  loaderData,
}) {
    const [pageHistory, setPageHistory] = useState([]);
    const pagedata = loaderData;

    return (
        <div>
            <h1>Asdfadsfdasf</h1>
           <div>{JSON.stringify(pagedata)}</div>
        </div>
    );
}

export default Game;
