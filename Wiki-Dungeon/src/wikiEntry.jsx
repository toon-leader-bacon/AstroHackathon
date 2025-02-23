import React, { useContext } from "react";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import "./WikiEntry.css";
import { PageHistoryContext } from "./App";

const WikiEntry = () => {
    const navigate = useNavigate();
    const { pageDataGetter } = useLoaderData();
    const { setPageHistory } = useContext(PageHistoryContext);

    const handlePageClick = (pageName) => {
        setPageHistory(decodeURI(pageName));
        navigate(`/game/${encodeURIComponent(pageName)}`);
    };

    // Use pageData if available, otherwise use placeholder

    return (
        <Await
            resolve={pageDataGetter}
            children={(pageDataValueOBJ) => {
                const pageDataValue = pageDataValueOBJ.pageData;
                return (
                    <div className="wikiEntry-container">
                        <div className="top-half">
                            <div className="summary">
                                <h1>{pageDataValue.title}</h1>
                                <p>{pageDataValue.extract}</p>
                            </div>
                            <div className="wiki-image">
                                <img
                                    src={
                                        pageDataValue?.thumbnail?.source ||
                                        "/api/placeholder/400/300"
                                    }
                                    alt={pageDataValue.title}
                                />
                            </div>
                        </div>

                        <div className="bottom-half">
                            {pageDataValue.links_and_riddles.map(
                                (pageName, index) => (
                                    <div
                                        key={index}
                                        className="image-link"
                                        onClick={() =>
                                            handlePageClick(
                                                pageName[0].split("/").at(-1)
                                            )
                                        }
                                    >
                                        <img
                                            src={`/api/placeholder/${200}/${200}`}
                                            alt={pageName}
                                        />
                                        <p>{pageName[1]}</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                );
            }}
        />
    );
};

export default WikiEntry;
