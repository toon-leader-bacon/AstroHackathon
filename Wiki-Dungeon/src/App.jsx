import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Game, { HydrateFallback, loadWikiDungenInfo } from "./Game";
import Title from "./Title";
import Instruction from "./instruction";
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  /** Put your mantine theme override here */
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Title />,
  },{
    path: "/instruction",
    element: <Instruction />,
  },
  {
    path: "/game/:initialpage",
    loader: ({ params }) => {
      return loadWikiDungenInfo(params.initialpage);
    },
    Component: Game,
    HydrateFallback: ()=><HydrateFallback />,
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
