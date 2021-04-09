import React from "react";

export default function Header(props) {
  const { selected } = props;

  return (
    <header className="header">
      <img
        className="logo"
        src="./images/logo.png"
        alt="Game Of Thrones logo"
        onClick={selected ? () => props.setSelected(null) : null}
      />
    </header>
  );
}
