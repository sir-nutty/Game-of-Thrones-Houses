import React, { Component } from "react";

import Header from "./components/header/header";
import Content from "./components/content";

import Themes from "./datastore/themes.json";

export default class App extends Component {
  state = {
    selected: null,
  };

  getTheme(banner) {
    if (!banner) {
      return null;
    } else {
      const index = Themes.findIndex((theme) => theme.name === banner.name);

      if (index !== -1) return Themes[index];
      else return null;
    }
  }

  render() {
    const { selected, theme } = this.state;

    return (
      <div className={"App" + (theme ? " " + theme.class + " theme" : "")}>
        <Header selected={selected} setSelected={this.setSelected} />
        <Content selected={selected} setSelected={this.setSelected} />
      </div>
    );
  }

  setSelected = (banner) => {
    this.setState({ selected: banner, theme: this.getTheme(banner) });
  };
}
