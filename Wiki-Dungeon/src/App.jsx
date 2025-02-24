import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Game from "./Game";
import Title from "./Title";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { createContext, useState } from "react";
import Instruction from "./instruction";

export const PageHistoryContext = createContext();

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
        path: "/game/:wikipage",
        element: <Game />,
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
            <MantineProvider theme={theme}>
                <RouterProvider router={router} />
            </MantineProvider>
        </PageHistoryContext.Provider>
    );
}

export default App;
