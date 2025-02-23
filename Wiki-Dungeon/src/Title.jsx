import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Title.css";
import { Button } from "@mantine/core";
import { PageHistoryContext } from "./App";

const interestingPages = [
  "Albert Einstein",
  "Mount Everest",
  "Marie Curie",
  "Paris",
  "Leonardo da Vinci",
  "Grand Canyon",
  "Mahatma Gandhi",
  "Tokyo",
  "Cleopatra",
  "Great Wall of China"
];

export default function Title() {
  const navigate = useNavigate();
  const {setPageHistory, resetPageHistory} = useContext(PageHistoryContext);

  const getRandomPage = () => {
    const randomIndex = Math.floor(Math.random() * interestingPages.length);
    resetPageHistory(interestingPages[randomIndex]);
    return navigate(`/game/${interestingPages[randomIndex]}`);
  }

  const goToInstructions = () => {
    navigate('/instruction');
  }

  return (
    <div className="title-container">
      <div className="title-content">
        <h1>Wikipedia Dungeon</h1>
        <p>Explore the depths of knowledge, one page at a time!</p>
        <div className="button-container">
          <Button onClick={getRandomPage} className="enter-button">
            Go To Random Start
          </Button>
          <Button onClick={goToInstructions} className="instructions-button">
            How to Play
          </Button>
        </div>
      </div>
    </div>
  );
};