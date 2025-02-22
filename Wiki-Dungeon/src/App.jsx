import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Game, { HydrateFallback, loadWikiDungenInfo } from "./Game";
import Title from "./Title";
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  /** Put your mantine theme override here */
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Title />,
  },
  {
    path: "/game/:initialpage",
    loader: ({ params }) => {
      return loadWikiDungenInfo(params.initialpage);
    },
    hydrateFallbackElement: <HydrateFallback />,
    element: <Game />,
  }
]);

function App() {
  return (
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export default App;
