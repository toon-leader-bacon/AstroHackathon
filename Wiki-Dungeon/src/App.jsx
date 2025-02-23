import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Game, { HydrateFallback, loadWikiDungenInfo } from "./Game";
import Title from "./Title";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { createContext, useState } from "react";

export const PageHistoryContext = createContext();
import Instruction from "./instruction";

const theme = createTheme({
    /** Put your mantine theme override here */
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <Title />,
    },
    {
        path: "/instruction",
        element: <Instruction />,
    },
    {
        path: "/game/:initialpage",
        loader: ({ params }) => {
            return loadWikiDungenInfo(params.initialpage);
        },
        Component: Game,
    },
]);

function App() {
    const [pageHistory, setPageHistory] = useState([]);
    return (
        <PageHistoryContext.Provider
            value={{
                pageHistory,
                setPageHistory: (newPage) => {
                    setPageHistory((prev) => [...prev, newPage]);
                },
                resetPageHistory: (val) => setPageHistory([val]),
            }}
        >
            {" "}
            <MantineProvider theme={theme}>
                <RouterProvider router={router} />
            </MantineProvider>
        </PageHistoryContext.Provider>
    );
}

export default App;
