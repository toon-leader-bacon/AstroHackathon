import React from "react";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import "./WikiEntry.css";

const WikiEntry = () => {
    const navigate = useNavigate();
    const pageData = useLoaderData();

    const handlePageClick = (pageName) => {
        navigate(`/game/${encodeURIComponent(pageName)}`);
    };

    // Use pageData if available, otherwise use placeholder
    const displayData = pageData || placeholderSummary;

    console.log(pageData);

    return (
        <Await resolve={pageData}>
            <div className="wikiEntry-container">
                <div className="top-half">
                    <div className="summary">
                        <h1>{displayData.title}</h1>
                        <p>{displayData.extract}</p>
                    </div>
                    <div className="wiki-image">
                        <img
                            src={
                                pageData?.thumbnail?.source ||
                                "/api/placeholder/400/300"
                            }
                            alt={displayData.title}
                        />
                    </div>
                </div>

                <div className="bottom-half">
                    {pageData.links_and_riddles.map((pageName, index) => (
                        <div
                            key={index}
                            className="image-link"
                            onClick={() => handlePageClick(pageName[0])}
                        >
                            <img
                                src={`/api/placeholder/${200}/${200}`}
                                alt={pageName}
                            />
                            <p>{pageName[1]}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Await>
    );
};

export default WikiEntry;
