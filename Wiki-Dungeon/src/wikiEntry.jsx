import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WikiEntry.css';

const WikiEntry = ({ pageData }) => {
  const navigate = useNavigate();
  
  const suggestedPages = [
    "Albert Einstein",
    "Leonardo da Vinci",
    "Marie Curie",
    "Mahatma Gandhi"
  ];

  const placeholderSummary = {
    title: "The Ancient Dungeon",
    extract: "Deep beneath the surface lies a vast network of mysterious chambers and corridors, each holding secrets of forgotten civilizations. The Ancient Dungeon, dating back to the 12th century, represents one of the most remarkable examples of medieval underground architecture. Its intricate stone passages and elaborate wall carvings suggest it served not only as a defensive structure but also as a center of learning and cultural preservation. Archaeological evidence indicates that scholars and artisans once gathered here to safeguard knowledge during tumultuous times. Recent discoveries have uncovered a complex system of hidden rooms and passages, suggesting that only a fraction of its mysteries have been revealed. The dungeon's unique architectural style combines elements from various historical periods, making it a fascinating subject for historians and archaeologists alike."
  };

  const handlePageClick = (pageName) => {
    navigate(`/game/${encodeURIComponent(pageName)}`);
  };

  // Use pageData if available, otherwise use placeholder
  const displayData = pageData || placeholderSummary;

  return (
    <div className="wikiEntry-container">
      <div className="top-half">
        <div className="summary">
          <h1>{displayData.title}</h1>
          <p>{displayData.extract}</p>
        </div>
        <div className="wiki-image">
          <img 
            src={pageData?.thumbnail?.source || "/api/placeholder/400/300"}
            alt={displayData.title}
          />
        </div>
      </div>

      <div className="bottom-half">
        {suggestedPages.map((pageName, index) => (
          <div 
            key={index}
            className="image-link"
            onClick={() => handlePageClick(pageName)}
          >
            <img
              src={`/api/placeholder/${200}/${200}`}
              alt={pageName}
            />
            <p>{pageName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WikiEntry;