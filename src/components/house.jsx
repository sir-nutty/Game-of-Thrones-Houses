import React, { Component } from "react";
import axios from "axios";

import Character from "./character";
import Loading from "./animation/loading";

import BannersData from "../datastore/banners.json";

export default class House extends Component {
  _isMounted = false;
  cancelToken = null;

  state = {
    isMembersLoading: true,
    isHighMemberLoading: true,
    lord: null,
    founder: null,
    members: this.getMembers(this.props.house.swornMembers),
    selectedMembers: null,
    pageNum: 0,
  };

  componentDidMount() {
    this._isMounted = true;
    this.cancelToken = axios.CancelToken.source();

    this.loadHouse(this.cancelToken);
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.cancelToken.cancel("Cancelling requests due to House unmount.");
  }

  getMembers(swornMembers) {
    var members = [];
    var memberPage = [];

    const limit = 10;
    var index = 0;
    const end = swornMembers[swornMembers.length - 1];

    swornMembers.forEach((member) => {
      if (index === limit) {
        // Break and add to new list
        members.push(memberPage);
        memberPage = [];
        index = 0;
      }

      if (member === end) {
        // Last member
        members.push(memberPage);
      }

      memberPage.push(member);
      index++;
    });

    return members;
  }

  async loadHouse(cancel) {
    const config = { cancelToken: cancel.token };

    this.loadHighMembers(
      this.props.house.currentLord,
      this.props.house.founder,
      config
    );

    this.loadMembers(this.state.members[this.state.pageNum], config);
  }

  async loadHighMembers(lordURL, founderURL, config) {
    await this.loadFounder(founderURL, config);
    await this.loadLord(lordURL, config);

    if (this._isMounted) this.setState({ isHighMemberLoading: false });
  }

  async loadLord(lordURL, config) {
    if (lordURL !== "") {
      await axios
        .get(lordURL, config)
        .then((response) => {
          if (this._isMounted) this.setState({ lord: response.data });
        })
        .catch((error) => console.log(error));
    }
  }

  async loadFounder(founderURL, config) {
    if (founderURL !== "") {
      await axios
        .get(founderURL, config)
        .then((response) => {
          if (this._isMounted) this.setState({ founder: response.data });
        })
        .catch((error) => console.log(error));
    }
  }

  async loadMembers(members, config) {
    let selectedMembers = [];

    for (let index = 0; index < members.length; index++) {
      await axios
        .get(members[index], config)
        .then((response) => {
          selectedMembers.push(response.data);
        })
        .catch((error) => console.log(error));
    }

    if (this._isMounted)
      this.setState({
        selectedMembers: selectedMembers,
        isMembersLoading: false,
      });
  }

  getBannerImage(name) {
    const index = BannersData.findIndex((banner) => banner.house === name);

    return BannersData[index].image;
  }

  render() {
    const { name, words } = this.props.house;
    const {
      isMembersLoading,
      isHighMemberLoading,
      founder,
      lord,
      members,
      selectedMembers,
      pageNum,
    } = this.state;

    return (
      <div className="house_container">
        <div className="banner_image">
          <img
            className="banner"
            src={this.getBannerImage(name)}
            alt={name}
            title={name}
          />
        </div>

        <div className="house_info">
          <div className="house_title">
            <h2>{name}</h2>
            <h3>{words}</h3>
          </div>

          {isHighMemberLoading && isMembersLoading ? (
            <div className="house_lords_loading">
              <Loading />
            </div>
          ) : (
            <React.Fragment>
              <div className="house_lords">
                <Character
                  character={lord}
                  css={"lord"}
                  label="Current Lord"
                  defaultMessage="Vacant"
                />
                <Character
                  character={founder}
                  css={"lord"}
                  label="Founder"
                  defaultMessage="Unknown"
                />
              </div>

              <div className="members_container">
                {isMembersLoading ? (
                  <div className="members_loading">
                    <Loading />
                  </div>
                ) : (
                  <div className="members_wrapper">
                    <div className="members">
                      {selectedMembers.map((member, index) => (
                        <Character
                          key={index}
                          character={member}
                          css={"member"}
                          label={""}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="member_pages">
                  <ul>
                    {members.map((member, index) => (
                      <li
                        key={index}
                        className={pageNum === index ? "active" : ""}
                        onClick={() => this.setPageNum(index)}
                      >
                        {index + 1}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }

  setPageNum = (index) => {
    this.setState({ pageNum: index, isMembersLoading: true });
    this.loadMembers(this.state.members[index]);
  };
}
