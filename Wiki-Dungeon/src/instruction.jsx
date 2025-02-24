import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@mantine/core";
import './instruction.css';

const instruction = () => {
  const navigate = useNavigate();

  const handleBackToTitle = () => {
    navigate('/');
  };

  return (
    <div className="instructions-container">
      <div className="instructions-content">
        <h1>How to Play Wikipedia Dungeon</h1>

        <div className="instruction-section">
          <h2>Game Overview</h2>
          <p>Wikipedia Dungeon is an educational exploration game where you navigate through Wikipedia articles as if exploring a dungeon!</p>
        </div>

        <div className="instruction-section">
          <h2>How to Play</h2>
          <ul>
            <li>To start the game, click on the start button to get a randomized Wikipedia page .
            </li>
            <li>Next, read the AI generated riddle and image.
            </li>
            <li>After reading the riddle, choose from the options provided that matches the riddle.
            </li>
            <li>Repeat until you find the treasure you seek.</li>
          </ul>
        </div>
        <Button
          onClick={handleBackToTitle}
          className="back-button"
        >
          Back to Title
        </Button>
      </div>
    </div>
  );
};

export default instruction;

