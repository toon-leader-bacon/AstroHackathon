import React from "react";
import { Link } from "react-router-dom";
import "./Title.css";

// export default Title = () => {
//     return (<></>)
// }

export default Title = () => {
    return (
      <div className="title-container">
        <div className="title-content">
          <h1>Wikipedia Dungeon</h1>
          <p>Explore the depths of knowledge, one page at a time!</p>
          <Link to="/Game">
            <button className="enter-button">Enter the Dungeon</button>
          </Link>
        </div>
      </div>
    );
  };