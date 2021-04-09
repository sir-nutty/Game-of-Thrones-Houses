import React, { Component } from "react";
import axios from "axios";

import Loading from "./animation/loading";
import Close from "./svg/close";

export default class Popup extends Component {
  _isMounted = false;
  cancelToken = null;

  state = {
    isLoading: true,
    allegiances: [],
    books: [],
  };

  componentDidMount() {
    this._isMounted = true;
    this.cancelToken = axios.CancelToken.source();

    this.loadCharacter(this.cancelToken);
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.cancelToken.cancel("Cancelling requests due to Character unmount.");
  }

  async loadCharacter(cancel) {
    const config = { cancelToken: cancel.token };

    await this.loadAllegiances(this.props.character.allegiances, config);
    await this.loadBooks(this.props.character.books, config);

    if (this._isMounted) this.setState({ isLoading: false });
  }

  async loadAllegiances(allegiances, config) {
    let loaded = [];

    for (let index = 0; index < allegiances.length; index++) {
      await axios
        .get(allegiances[index], config)
        .then((response) => loaded.push(response.data))
        .catch((error) => console.log(error));
    }

    if (this._isMounted) this.setState({ allegiances: loaded });
  }

  async loadBooks(books, config) {
    let loaded = [];

    for (let index = 0; index < books.length; index++) {
      await axios
        .get(books[index], config)
        .then((response) => loaded.push(response.data))
        .catch((error) => console.log(error));
    }

    if (this._isMounted) this.setState({ books: loaded });
  }

  getInfo(info) {
    return info === "" ? "N/A" : info;
  }

  render() {
    const { character, toggle, image } = this.props;
    const { isLoading, books, allegiances } = this.state;

    return (
      <React.Fragment>
        <div className="overlay" onClick={() => toggle()} />
        <div className={"popup" + (isLoading ? "" : " popup_loaded")}>
          {isLoading ? (
            <Loading />
          ) : (
            <React.Fragment>
              <div className="popup_title">
                <div className="title_name">
                  <h2>{character.name}</h2>
                </div>

                <div className="title_close">
                  <Close close={toggle} />
                </div>
              </div>

              <div className="popup_content">
                <section className="popup_info">
                  <div className="popup_image">
                    <img
                      src={image}
                      alt={character.name}
                      title={character.name}
                    />
                  </div>

                  <div className="popup_culture">
                    <span className="culture">
                      {"Culture: " + this.getInfo(character.culture)}
                    </span>
                  </div>

                  <div className="popup_life">
                    <span className="born">
                      {"Born: " + this.getInfo(character.born)}
                    </span>
                    <span className="died">
                      {"Died: " + this.getInfo(character.died)}
                    </span>
                  </div>
                </section>

                {character.aliases[0] !== "" ? (
                  <section className="popup_aliases">
                    <div className="popup_subtitle">
                      <h3>Aliases</h3>
                    </div>

                    <div className="popup_container">
                      <ul>
                        {character.aliases.map((alias, index) => (
                          <li key={index}>{alias}</li>
                        ))}
                      </ul>
                    </div>
                  </section>
                ) : (
                  <React.Fragment />
                )}

                {character.titles[0] !== "" ? (
                  <section className="popup_titles">
                    <div className="popup_subtitle">
                      <h3>Titles</h3>
                    </div>

                    <div className="popup_container">
                      <ul>
                        {character.titles.map((title, index) => (
                          <li key={index}>{title}</li>
                        ))}
                      </ul>
                    </div>
                  </section>
                ) : (
                  <React.Fragment />
                )}

                {character.allegiances.length !== 0 ? (
                  <section className="popup_allegiances">
                    <div className="popup_subtitle">
                      <h3>Allegiances</h3>
                    </div>

                    <div className="popup_container">
                      <ul>
                        {allegiances.map((allegiance, index) => (
                          <li key={index}>{allegiance.name}</li>
                        ))}
                      </ul>
                    </div>
                  </section>
                ) : (
                  <React.Fragment />
                )}

                {character.books.length !== 0 ? (
                  <section className="popup_books">
                    <div className="popup_subtitle">
                      <h3>Books</h3>
                    </div>

                    <div className="popup_container">
                      <ul>
                        {books.map((book, index) => (
                          <li key={index}>{book.name}</li>
                        ))}
                      </ul>
                    </div>
                  </section>
                ) : (
                  <React.Fragment />
                )}

                {character.tvSeries[0] !== "" ? (
                  <section className="popup_tv">
                    <div className="popup_subtitle">
                      <h3>TV Series</h3>
                    </div>

                    <div className="popup_actor">
                      <span className="died">
                        {"Played By: " + this.getInfo(character.playedBy)}
                      </span>
                    </div>

                    <div className="popup_container">
                      <ul>
                        {character.tvSeries.map((season, index) => (
                          <li key={index}>{season}</li>
                        ))}
                      </ul>
                    </div>
                  </section>
                ) : (
                  <React.Fragment />
                )}
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}
