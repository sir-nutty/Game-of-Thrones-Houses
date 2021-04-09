import React, { Component } from "react";

import CharacterImages from "../datastore/characterImages.json";

import Popup from "./popup";

export default class Character extends Component {
  defaultImage = "./images/characters/default.png";

  state = {
    isPopup: false,
  };

  getImage(url) {
    const start = url.lastIndexOf("characters/") + "characters/".length;
    const id = parseInt(url.substring(start));
    const index = CharacterImages.findIndex((character) => character.id === id);
    let image = null;

    if (index !== -1) {
      image = CharacterImages[index].image;
    } else {
      image = this.defaultImage;
    }

    return image;
  }

  render() {
    const { isPopup } = this.state;
    const { css, label, character, defaultMessage } = this.props;

    const image = character ? this.getImage(character.url) : this.defaultImage;
    const name = character ? character.name : defaultMessage;

    return (
      <React.Fragment>
        <div
          className={"character_container " + css}
          onClick={character ? this.togglePopup : null}
        >
          <label>{label}</label>
          <img className="character" src={image} alt={name} title={name}></img>
          <label>{name}</label>
        </div>

        {isPopup ? (
          <Popup
            character={character}
            image={image}
            toggle={this.togglePopup}
          />
        ) : (
          <React.Fragment />
        )}
      </React.Fragment>
    );
  }

  togglePopup = () => {
    this.setState({ isPopup: !this.state.isPopup });
  };
}
