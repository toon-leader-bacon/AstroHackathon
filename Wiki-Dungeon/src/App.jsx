import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./Game";
import { Title } from "./Title";
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Title />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
