import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Title.css";
import { Button } from "@mantine/core";

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

  const getRandomPage = () => {
    const randomIndex = Math.floor(Math.random() * interestingPages.length);
    return navigate(`/game/${interestingPages[randomIndex]}`);
  }

  return (
    <div className="title-container">
      <div className="title-content">
        <h1>Wikipedia Dungeon</h1>
        <p>Explore the depths of knowledge, one page at a time!</p>
        <Button onClick={getRandomPage} className="enter-button">Go To Random Start</Button>
      </div>
    </div>
  );
};