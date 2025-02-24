import React, { useContext } from "react";
import { Await, useNavigate } from "react-router-dom";
import "./WikiEntry.css";
import { PageHistoryContext } from "./App";

const WikiEntry = ({scrapedWikiAndAIImages}) => {
    const navigate = useNavigate();
    const { setPageHistory } = useContext(PageHistoryContext);

    const handlePageClick = (pageName) => {
        setPageHistory(decodeURI(pageName));
        navigate(`/game/${encodeURIComponent(pageName)}`);
    };

    return (
        <Await
            resolve={scrapedWikiAndAIImages}
            children={(pageDataValueOBJ) => {
                const pageDataValue = pageDataValueOBJ.pageData;
                return (
                    <div className="wikiEntry-container">
                        <div className="top-half">
                            <div className="summary">
                                <h1>{pageDataValue.name}</h1>
                                <p>{pageDataValue.summary}</p>
                            </div>
                            <div className="wiki-image">
                                <img
                                    src={`${
                                        import.meta.env.VITE_BACKEND_URL_PY
                                    }${pageDataValue.main_image.replace(
                                        /^\./,
                                        ""
                                    )}`}
                                    alt={pageDataValue.title}
                                />
                            </div>
                        </div>

                        <div className="bottom-half">
                            {pageDataValue.links_riddles_and_sub_images.map(
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
                                            src={`${
                                                import.meta.env
                                                    .VITE_BACKEND_URL_PY
                                            }${pageName[2].replace(/^\./, "")}`}
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
