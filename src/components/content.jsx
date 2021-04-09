import React, { Component } from "react";
import axios from "axios";

import Banners from "./banners";
import House from "./house";
import Loading from "./animation/loading";

export default class Content extends Component {
  _isMounted = false;
  cancelToken = null;

  state = {
    loading: true,
    stark: null,
    targaryen: null,
    lannister: null,
    baratheon: null,
    greyjoy: null,
    contentHeight: null,
  };

  componentDidMount() {
    window.addEventListener("resize", this.setContentHeight.bind(this));
    this._isMounted = true;
    this.cancelToken = axios.CancelToken.source();

    this.loadHouses(this.cancelToken);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setContentHeight.bind(this));
    this._isMounted = false;
    this.cancelToken.cancel("Cancelling requests due to Content unmount.");
  }

  async loadHouses(cancel) {
    const base_url = process.env.REACT_APP_API_BASE_URL;
    const params = {};
    const config = { cancelToken: cancel.token };
    const house_url = base_url + "houses";

    await this.loadStark(house_url, params, config);
    await this.loadTargaryen(house_url, params, config);
    await this.loadLannister(house_url, params, config);
    await this.loadBaratheon(house_url, params, config);
    await this.loadGreyjoy(house_url, params, config);

    if (this._isMounted) this.setState({ loading: false });
  }

  async loadStark(url, params, config) {
    params.name = "House Stark of Winterfell";
    axios
      .get(url, { params }, config)
      .then((response) => {
        if (this._isMounted) this.setState({ stark: response.data[0] });
      })
      .catch((error) => console.log(error));
  }

  async loadTargaryen(url, params, config) {
    params.name = "House Targaryen of King's Landing";
    axios
      .get(url, { params }, config)
      .then((response) => {
        if (this._isMounted) this.setState({ targaryen: response.data[0] });
      })
      .catch((error) => console.log(error));
  }

  async loadLannister(url, params, config) {
    params.name = "House Lannister of Casterly Rock";
    axios
      .get(url, { params }, config)
      .then((response) => {
        if (this._isMounted) this.setState({ lannister: response.data[0] });
      })
      .catch((error) => console.log(error));
  }

  async loadBaratheon(url, params, config) {
    params.name = "House Baratheon of Storm's End";
    axios
      .get(url, { params }, config)
      .then((response) => {
        if (this._isMounted) this.setState({ baratheon: response.data[0] });
      })
      .catch((error) => console.log(error));
  }

  async loadGreyjoy(url, params, config) {
    params.name = "House Greyjoy of Pyke";
    axios
      .get(url, { params }, config)
      .then((response) => {
        if (this._isMounted) this.setState({ greyjoy: response.data[0] });
      })
      .catch((error) => console.log(error));
  }

  setContentHeight() {
    const windowWidth = window.innerWidth;

    if (windowWidth <= 600) {
      // Mobile screen, should be using min-height
      if (this._isMounted)
        this.setState({
          contentHeight: null,
          contentMinHeight: this.getContentMinHeight(),
        });
    } else {
      if (this._isMounted)
        this.setState({
          contentHeight: this.getContentHeight(),
          contentMinHeight: null,
        });
    }
  }

  getContentHeight() {
    const headerHeight = document.getElementsByClassName("header")[0]
      .clientHeight;

    const windowHeight = window.innerHeight;

    return "" + (windowHeight - headerHeight) + "px";
  }

  getContentMinHeight() {
    const headerHeight = document.getElementsByClassName("header")[0]
      .clientHeight;

    return "calc(100vh - " + headerHeight + "px)";
  }

  render() {
    const { loading, contentHeight, contentMinHeight } = this.state;
    const { selected } = this.props;

    return (
      <div
        className="content"
        style={
          selected
            ? contentHeight
              ? { height: contentHeight }
              : { minHeight: contentMinHeight }
            : null
        }
      >
        {selected ? (
          <House house={selected} />
        ) : loading ? (
          <Loading />
        ) : (
          <Banners setBanner={this.setBanner} />
        )}
      </div>
    );
  }

  setBanner = (bannerName) => {
    this.props.setSelected(this.getBanner(bannerName));
    this.setContentHeight();
  };

  getBanner(bannerName) {
    var banner;

    switch (bannerName) {
      case "House Stark of Winterfell":
        banner = this.state.stark;
        break;
      case "House Targaryen of King's Landing":
        banner = this.state.targaryen;
        break;
      case "House Lannister of Casterly Rock":
        banner = this.state.lannister;
        break;
      case "House Baratheon of Storm's End":
        banner = this.state.baratheon;
        break;
      case "House Greyjoy of Pyke":
        banner = this.state.greyjoy;
        break;
      default:
        break;
    }

    return banner;
  }
}
