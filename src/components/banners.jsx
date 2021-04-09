import React from "react";

import BannersData from "../datastore/banners.json";

export default function Banners(props) {
  return (
    <div className={"banners_wrapper"}>
      {BannersData.map((banner, index) => (
        <div
          key={index}
          className={"banner_container theme " + banner.name.toLowerCase()}
          onClick={() => props.setBanner(banner.house)}
        >
          <div className="banner_blur">
            <div className="banner" />
          </div>

          <div className={"banner_overlay theme " + banner.name.toLowerCase()}>
            <div className="banner_overlay_text">
              <h1>{banner.name}</h1>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
