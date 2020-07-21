import React, { Suspense, lazy } from "react";
import axios from "axios";
import {
  Container,
  Dimmer,
  Image,
  Loader,
  Message,
  Segment,
  Button,
  Grid,
  Dropdown,
  Icon,
  Responsive,
} from "semantic-ui-react";
import { partsFilterListURL, itemFilterListURL } from "../constants";
// import { Link } from "react-router-dom";
import Axios from "axios";
import ProductListFilterStartPage from "./ProductListFilterStartPage";
// import ProductListFilterResult from "./ProductListFilterResult";
import { Spring, config, animated } from "react-spring/renderprops";
// const ProductListFilterStartPage = lazy(() =>
//   import("./ProductListFilterStartPage")
// );
// import loader_gif from "../../src/Motobyke.gif";

const ProductListFilterResult = lazy(() => import("./ProductListFilterResult"));

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.toggleContent = this.toggleContent.bind(this);
  }
  state = {
    loading: false,
    error: null,
    data: [],
    filterSelection: {
      value1: "",
      value2: "",
      value3: "",
      value4: "",
      value5: "",
      value6: "",
    },
    drop: {
      make: [],
      model: [],
      model_year: [],
      part_type: [],
      part_category: [],
      name: [],
    },
    componentRender: {
      toggleStartPage: true,
      toggleResultPage: false,
    },
    filterResultFromServer: [],
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(partsFilterListURL)
      .then((res) => {
        this.setState({
          data: res.data,
          loading: false,
        });
        this.populateDropdown(this.state.data);
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
    this.setState({ toggleStartPage: true, toggleResultPage: false });
  }

  // populateDropdown = (data) => {
  //   // var dropJson = {};
  //   Object.keys(this.state.drop).map((key) =>
  //     this.setState({
  //       [key]: data[key],
  //     })
  //   );
  // };

  toggleContent() {
    this.setState({
      toggleStartPage: false,
      toggleResultPage: true,
    });
  }

  populateDropdown = (data) => {
    // var dropJson = {};
    Object.keys(this.state.drop).map((key) => {
      let dataParameter = [];
      data[key].map((value, key) => {
        value["value"] = JSON.stringify({
          key: value.id,
          value: value.text,
        });
        value["key"] = value.id;
        return (dataParameter = [...dataParameter, value]);
      });
      // console.log(dataParameter);
      return this.setState({
        [key]: dataParameter,
      });
    });
  };

  filterResult = () => {
    // console.log("test");
    let url = itemFilterListURL + "?";
    Object.keys(this.state.drop).map((filterValues, key) => {
      if (this.state["value" + (key + 1)]) {
        let filterValue = JSON.parse(this.state["value" + (key + 1)]);
        url = url + filterValues + "=" + filterValue.key + "&";
      }
      return url;
    });
    url = url.slice(0, -1);
    Axios.get(url).then((res) => {
      this.setState(
        { filterResultFromServer: res.data },
        () => {
          this.toggleContent();
        }
        // console.log(this.props);
      );
    });
  };

  discountPrice = (price, discount_price) => {
    var sumPrice = price - discount_price;
    return sumPrice;
  };

  changeTitle = (event) => {
    // console.log(event);
  };

  getUnique(arr, comp) {
    const unique = arr
      //store the comparasion value in array
      .map((e) => e[comp])
      //store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)
      //eliminate the dead keys & store unique objects
      .filter((e) => arr[e])
      .map((e) => arr[e]);
    return unique;
  }

  handleResetToInitialOne = (cat) => {
    // const category = [...this.state[cat]];
    // category[key] = val;
    let dataParameter = [];
    this.state.data[cat] &&
      this.state.data[cat].map((value, key) => {
        value["value"] = JSON.stringify({
          key: value.id,
          value: value.text,
        });
        value["key"] = value.id;
        return (dataParameter = [...dataParameter, value]);
      });
    return dataParameter;
  };

  handleSetState(cat, key, val) {
    const category = { ...this.state[cat] };
    if (typeof key === "string") {
      category[key] = val;
    } else {
      key.map((item, index) => {
        return (category[item] = val[index]);
      });
    }
    this.setState({ [cat]: category });
  }

  handleClear = (e) => {
    this.setState(
      {
        value1: "",
        value2: "",
        value3: "",
        value4: "",
        value5: "",
        value6: "",
      },
      () => {
        this.filterResult();
      }
    );
  };

  handleChange1 = (none, { value }) => {
    const selectedArray = "model";
    var selected_value = JSON.parse(value);
    var reset = this.handleResetToInitialOne(selectedArray);
    this.setState({ [selectedArray]: reset }, () => {
      this.setState({
        value1: value,
        value2: "",
        value3: "",
        [selectedArray]: this.state[selectedArray].filter(
          (parent) => parent.parent === selected_value.key
        ),
      });
    });
  };

  handleChange2 = (none, { value }) => {
    const selectedArray = "model_year";
    var selected_value = JSON.parse(value);
    var reset = this.handleResetToInitialOne(selectedArray);
    this.setState({ [selectedArray]: reset }, () => {
      this.setState({
        value2: value,
        value3: "",
        [selectedArray]: this.state[selectedArray].filter(
          (parent) => parent.parent === selected_value.key
        ),
      });
    });
  };
  handleChange3 = (none, data) => this.setState({ value3: data.value });
  handleChange4 = (none, { value }) => {
    const selectedArray = "part_category";
    var selected_value = JSON.parse(value);
    var reset = this.handleResetToInitialOne(selectedArray);
    this.setState({ [selectedArray]: reset }, () => {
      this.setState({
        value4: value,
        value5: "",
        value6: "",
        [selectedArray]: this.state[selectedArray].filter(
          (parent) => parent.parent === selected_value.key
        ),
      });
    });
  };
  handleChange5 = (none, { value }) => {
    const selectedArray = "part";
    var selected_value = JSON.parse(value);
    var reset = this.handleResetToInitialOne(selectedArray);
    this.setState({ [selectedArray]: reset }, () => {
      this.setState({
        value5: value,
        value6: "",
        [selectedArray]: this.state[selectedArray].filter(
          (parent) => parent.parent === selected_value.key
        ),
      });
    });
  };
  handleChange6 = (none, data) => this.setState({ value6: data.value });

  render() {
    const {
      error,
      loading,
      value1,
      value2,
      value3,
      value4,
      value5,
      value6,
      toggleStartPage,
      toggleResultPage,
    } = this.state;
    // console.log("Filter", this.props);
    return (
      <Container style={{ margin: "5em 0em 0em" }}>
        {error && (
          <Message
            error
            header="There was some errors with your submission"
            content={JSON.stringify(error)}
          />
        )}
        {loading && (
          <Segment>
            <Dimmer active inverted>
              {/* <Loader icon="motorcycle" className="test">
                Ucitavanje
              </Loader> */}
              {/* <svg
                className="loader"
                xmlns="http://www.w3.org/2000/svg"
                version="1.0"
                viewBox="0 0 1280 701"
              >
                <path
                  fill="#ffeb3b"
                  d="M990 4l-2 9-1 6-8-5c-7-5-7-5-10-4l-23 25-5 10v4h-13c-15 0-17 1-17 6l2 6c1 1 2 3 2 11 0 9 1 11 3 11l1 6v5l-3-1c-3 0-5-2-11-8-2-2-3-2-4 0h-3c-2-3-3 1-3 9v8l-2 3-8 5c-7 4-8 5-6 8v3c-2 2 1 9 4 11 4 1 4 3 0 6l-3 5c0 4-3 6-6 4v-2c3-2 2-2-1-4-2 0-4-3-7-8-5-8-6-9-18-15a429 429 0 00-107-29 234 234 0 00-92-8l-18 7c-46 17-81 40-91 60l-6 20c-2 10-4 14-4 13l-18-1c-36-2-54-4-79-10a734 734 0 01-109-34l-7 1c-3 0-6 2-10 4l-7 3c-2 0-7-10-7-12l-1-2c-2-2-1-3 2-3s4 0 5-3l1-6c0-7-8-18-18-24l-6-5-3-1-7-1-10-2-14-1-43-8-49-8-22-3c-7 0-11 0-32-4l-32-4 7 7 14 14a592 592 0 00113 81c0 2-6 5-49 27l-33 17-3-2-15-1c-21 0-53-5-62-11-5-3-7-3-13-4-9 0-18 2-20 5-2 4-3 10-2 11l27 9c5 1 6 1 5 2l-1 10v9l3 1 5 4c2 2 2 2 0 6-1 2-2 5-4 6l-4 2c-1 2-2 2-4 1-4-2-6 0-9 6-4 6-3 6 3 10l3 3-4 8c-3 5-4 6-6 6s-4 3-2 6c1 1 1 2-2 6-2 5-3 5-6 5-5 0-6 2-3 4 2 2 2 2 1 6l-1 4 4-1c3 0 4-2 10-12 8-16 14-22 24-25l22-10c17-8 18-9 22-19 7-13 13-18 22-18 3 0 5 0 10-5 5-3 8-5 11-5l6-2c1-1 3-2 5-1 3 0 4 0 6-2 2-3 2-3 1-4l-1-1a1435 1435 0 0183-26l9-3 8 4 11 4 9 3a769 769 0 0064 35c0 2-15 38-17 40-1 1-12-10-13-14-1-3-4-5-6-3l-1 5c0 3 1 5 6 11 8 10 8 10 5 12s-3 3-2 6v4c-1 1-11-2-13-5l-5-3-4-4-7-8-5-6c0-3-2-2-3 0-2 3 0 7 7 16l7 9-4-1h-3l-6-1-4-2-1 5c-1 5-1 5 6 15l7 11h-2A195 195 0 0049 419a195 195 0 0082 259c2 3 18 9 29 12a969 969 0 0027 7 193 193 0 00229-139l3-10 10 4c6 3 8 5 8 6l5 21c0 2-1 3-13 13-6 5-8 8-8 9 1 1 0 3-2 4l-3 3a419 419 0 0071 4h74l174 1a3136 3136 0 00173-1l-5-12c-10-23-18-46-20-57v-31l3-12a101 101 0 0124-47l-2 10c-5 18-6 24-7 47 0 29 1 38 10 62l4 13c0 2 2 7 5 11l5 10c4 8 20 29 25 35 10 11 24 23 34 30 19 12 43 22 66 27 10 2 13 2 40 2h30l16-4a621 621 0 0130-9l8-3 5-3 11-7a186 186 0 0073-238 194 194 0 00-101-97l11-2 10-3a195 195 0 00-89-19 257 257 0 00-30 0 508 508 0 0157-29c4 0 8-2 8-5s-2-5-7-8c-4-2-6-4-7-7l-1-3 18-1a127 127 0 0041-7c3-2 3-6-1-8-2-1-3-2-3-6-1-13-12-32-29-51l-10-13 10 9 10 8v-4c-1-9-15-30-27-44l-15-17-57-58c-13-12-14-12-14-17l1-7c2-4 1-11-1-15-2-6-10-14-16-18-7-6-21-12-26-14-3 0-3 0-5 4zm-27 66c14 10 16 12 18 21 1 3 1 3 14 9l15 8v3l-1 3-7 9c-8 9-10 12-8 13l1 3c0 3 5 7 6 6l2 2c2 2 3 3 6 3 2 0 3 0 3 2s2 3 3 1h2c0 2-4 4-8 4l-9-2-14-2c-5 0-7-1-8-2-4-9-6-16-5-19l5-8c5-8 7-13 5-16-2-6-9-5-15 1-4 3-4 3-4 1 0-3-3-10-6-11-2-2-3-2-6 0-5 1-5 1-6-2 0-5-1-10-3-11-1-2-1-2 1-3 3 0 3-4 2-15l1-8 16 10zm11 47c-5 8-5 8-6 5v-5l8-6-2 6zm-769 58l5 5-8 4-8 3-5-2c-5-3-7-5-4-7l14-6 6 3zm-28 13c3 2 2 4-3 6-7 2-9 2-12 0s-2-4 3-7c4-2 9-2 12 1zm-26 10c1 2 1 2-1 3l-4 1-4 1c-1 2-2 2-3 1-2-2-2-2 2-4 5-3 8-4 10-2zm189 35c1 1-1 6-6 19-7 18-11 26-13 26-3-1-2-5 6-23l10-21c0-2 1-3 3-1zm14 7c2 0 3 1 3 2l-14 15 3-8 3-9c1-2 1-2 5 0zm24 11c2 2 7 4 10 4l12 6c14 10 28 16 61 28l38 14c10 5 10 5 10 8v4h-9c-9 0-11 1-16 7-5 9 0 22 10 24 4 0 5 2 5 6 0 3 1 4 3 4 3 1 4 3 2 3s-3 5-1 7 1 3-2 6c-5 4-7 4-11-2-2-3-10-8-27-14a99 99 0 01-35-19l-11-8c-11-10-14-12-24-14-9-1-13-1-23 4l-8 3-6-3a585 585 0 00-32-14l52-56 2 2zm19 75l22 19-7-2-8-3-5-1-20-10c-5-2-5-3-1-4 5-2 14-1 19 1zm-144 63c8 2 26 9 26 10a274 274 0 01-45 7c-2 0-5-13-3-17 1-3 1-3 7-2l15 2zm866 8a118 118 0 0176 59l2 5-5 5-8 6-3 2-2-5c-5-8-14-18-23-27-11-10-19-15-28-19s-11-6-11-9c0-2-4-8-7-12l-4-4-2-3h2l12 3zm-828 16c-3 3-5 3-6 1 0-1 3-3 7-3 2 0 2 0-1 2zm-13 7l-1 2h-3c-4 0-4-1-1-3 3-1 5-1 5 1zm-65 0l-3 1c-21 4-22 4-22 9 0 3-2 4-3 2s-4-1-5 1l1 4c1 2 1 2-1 4s-3 4-3 7l-4 7-3 5-5 6-4 4-12-1-31-4c-4-3-5-4-1-12 4-9 14-23 19-28l4-3 2 2c2 3 5 3 40-1a4197 4197 0 0031-3zm798 17l8 5-4 4-4 5-8-1c-8 0-8-1-7-8 0-4 4-9 7-9l8 4zm108 12l9 5c1 3-1 3-6 0l-9-5-4-2 10 2zm-1 11c2 0 3 1 3 2s-3 4-5 4c-1 1-2 0-4-4l-2-5 8 3zm-133 8c4 8 4 10 3 11-3 0-10-2-11-4l5-12 3 5zm140 0l-1 3c-4 5-5 3-2-2 1-2 3-3 3-1zm29 9c4 7 4 9 1 10l-4-3-5-7c-4-5-4-5-1-5 4-2 5-1 9 5zm-23-1c1 1-1 5-3 5v-5h3zm73 3c5 3 8 37 6 51l-10 34c-4 8-12 21-19 28-6 7-8 7-14 4-8-4-8-4 0-13a100 100 0 0022-87l-1-5c-1-5-1-5 2-7l12-6 2 1zm-61 2l2 5c0 3 0 3-6 3s-6 0-6-3c0-4 3-7 6-7l4 2zm-1012 7l16 3c4 2 4 2 4 6-1 9 0 25 1 31 3 9 7 17 13 25l5 6-6 15c-8 19-10 22-13 23-3 0-4-1-12-8-7-8-20-26-21-31l-4-9c-6-15-10-34-9-50 1-10 2-13 4-14s9 0 22 3zm853 8c2 5 2 7-2 10l-5 5v14l1 5c1 8 3 11 10 12l7 2 5 10c5 12 12 22 21 32l7 8-3 6-5 7c-2 2-2 2-6-1-5-3-14-12-20-21-16-20-24-45-24-72 0-12 1-17 6-18s8-1 8 1zm-662 18l20 8 1 4c2 8-2 13-8 14l-17 4a1077 1077 0 01-40 11l2-4c0-2 1-3 4-3s3 0 3-4c0-3 0-3 3-4 3 0 3 0 2-4 0-3 0-3 3-4 3 0 3-1 2-6l2-3c3-1 3-2 1-4-2-3-1-4 1-5 3-1 4-4 1-5a553 553 0 0120 5zm828 3c-1 6-3 9-6 9-2 0-2 0-2-4 0-5 3-9 7-9 2 0 2 0 1 4zm6 4c0 6-1 9-3 10-2 0-2-1 0-5l1-8 1-2 1 5zm-110 21l-1 4c0 2-2 3-5 2s-2-3 2-6 5-3 4 0zm92 4l-4 5c-4 5-6 5-4 1 2-5 6-8 8-6zm-801 4c-7 16-21 38-26 40l-5-1c-3-2-20-19-23-24l-2-3h4l4-1 4-1 5-1 3-2 16-4 4-1 7-2 6-2 2-1c2-2 3-1 1 3zm808 3l-10 11-2-1c-1-2 0-3 4-8 5-6 6-7 7-5l1 3zm-112-1l1 3c1 3-1 3-4-1l-3-3 6 1zm51 9c-1 1-3-1-2-2h1l1 2zm13 0h-3c-2 0-2 0-1-1s4 0 4 1zm-25 2c4 2 4 4 0 6-2 1-2 1-7-1l-4-1 2-3c3-2 6-3 9-1zm36 4c1 2 0 2-4 3-7 2-9 2-9 1 0-2 1-3 5-4h8zm-840 16c12 9 20 17 21 19 2 4 0 6-9 10-30 15-63 17-94 6-5-1-14-6-15-7-2-1 2-11 7-19l11-19 8 3c7 2 8 3 24 2h17l8-3c10-4 8-5 22 8zm800-10c5 2 6 3 5 4-2 1-3 1-6-1l-7-5 8 2zm47 1c-1 4-5 5-13 6-5 0-7-1-7-2l8-4c11-2 12-2 12 0zm-56 3l3 2-5-2-3-3 5 3zm98 31c2 3 2 3 0 5-7 7-30 16-46 19-14 2-38 1-50-2-11-3-23-8-24-10-2-3 2-18 4-18l7 3 8 4 4 2a101 101 0 0087-10c1-2 2-2 5 1l5 6z"
                />
              </svg> */}
              {/* <div className="loading"> */}
              {/* <img
                className="loading"
                src={require("../../src/Motobyke.gif")}
                alt="loading"
              /> */}
              {/* </div> */}

              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#eee"
                className="loader"
              >
                <g fill="none" fill-rule="evenodd">
                  <g transform="translate(1 1)" stroke-width="2">
                    <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
                    <path d="M36 18c0-9.94-8.06-18-18-18">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 18 18"
                        to="360 18 18"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>
                </g>
              </svg>
              {/* <div id="cssload-wrapper">
                <div className="cssload-loader">
                  <div className="cssload-line"></div>
                  <div className="cssload-line"></div>
                  <div className="cssload-line"></div>
                  <div className="cssload-line"></div>
                  <div className="cssload-line"></div>
                  <div className="cssload-line"></div>
                  <div className="cssload-subline"></div>
                  <div className="cssload-subline"></div>
                  <div className="cssload-subline"></div>
                  <div className="cssload-subline"></div>
                  <div className="cssload-subline"></div>
                  <div className="cssload-loader-circle-1">
                    <div className="cssload-loader-circle-2"></div>
                  </div>
                  <div className="cssload-needle"></div>
                  <div className="cssload-loading">loading</div>
                </div>
              </div> */}
            </Dimmer>

            <Image src="/images/wireframe/short-paragraph.png" />
          </Segment>
        )}

        <Responsive {...Responsive.onlyMobile}>
          <Segment>
            <Grid divided>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Dropdown
                  placeholder="Select Make"
                  fluid
                  search
                  options={this.state.make}
                  selection={true}
                  value={value1}
                  onChange={this.handleChange1}
                />
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Dropdown
                  placeholder="Select Model"
                  fluid
                  search
                  selection
                  value={value2}
                  options={this.state.model}
                  onChange={this.handleChange2}
                />
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Dropdown
                  placeholder="Select Year"
                  fluid
                  search
                  selection
                  value={value3}
                  options={this.state.model_year}
                  onChange={this.handleChange3}
                />
              </Grid.Column>

              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Dropdown
                  placeholder="Select Type"
                  fluid
                  search
                  selection
                  value={value4}
                  options={this.state.part_type}
                  onChange={this.handleChange4}
                />
              </Grid.Column>

              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Dropdown
                  placeholder="Select Category"
                  fluid
                  search
                  selection
                  value={value5}
                  options={this.state.part_category}
                  onChange={this.handleChange5}
                />
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Dropdown
                  placeholder="Select Part"
                  fluid
                  search
                  selection
                  value={value6}
                  options={this.state.name}
                  onChange={this.handleChange6}
                />
              </Grid.Column>
              <Grid.Column stretched mobile={16} tablet={8} computer={4}>
                <Button color="green" inverted onClick={this.filterResult}>
                  <Icon name="motorcycle" size="big" />
                  Suche
                </Button>
              </Grid.Column>

              <Grid.Column stretched mobile={16} tablet={8} computer={4}>
                <Button color="black" onClick={this.handleClear}>
                  <Icon name="x" />
                  Filter zurücksetzen
                </Button>
              </Grid.Column>
            </Grid>
          </Segment>
        </Responsive>

        <Responsive {...Responsive.onlyTablet}>
          <Segment>
            <Grid divided>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Dropdown
                  placeholder="Select Make"
                  fluid
                  search
                  selection
                  value={value1}
                  options={this.state.make}
                  onChange={this.handleChange1}
                />
              </Grid.Column>

              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Dropdown
                  placeholder="Select Type"
                  fluid
                  search
                  selection
                  value={value4}
                  options={this.state.part_type}
                  onChange={this.handleChange4}
                />
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Dropdown
                  placeholder="Select Model"
                  fluid
                  search
                  selection
                  value={value2}
                  options={this.state.model}
                  onChange={this.handleChange2}
                />
              </Grid.Column>

              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Dropdown
                  placeholder="Select Category"
                  fluid
                  search
                  selection
                  value={value5}
                  options={this.state.part_category}
                  onChange={this.handleChange5}
                />
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Dropdown
                  placeholder="Select Year"
                  fluid
                  search
                  selection
                  value={value3}
                  options={this.state.model_year}
                  onChange={this.handleChange3}
                />
              </Grid.Column>

              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Dropdown
                  placeholder="Select Part"
                  fluid
                  search
                  selection
                  value={value6}
                  options={this.state.name}
                  onChange={this.handleChange6}
                />
              </Grid.Column>
              <Grid.Column stretched mobile={16} tablet={8} computer={4}>
                <Button color="green" inverted onClick={this.filterResult}>
                  <Icon name="motorcycle" size="big" />
                  Suche
                </Button>
              </Grid.Column>

              <Grid.Column stretched mobile={16} tablet={8} computer={4}>
                <Button color="black" onClick={this.handleClear}>
                  <Icon name="x" />
                  Filter zurücksetzen
                </Button>
              </Grid.Column>
            </Grid>
          </Segment>
        </Responsive>

        <Responsive minWidth={Responsive.onlyComputer.minWidth}>
          <Segment style={{ borderWidth: "3px", borderColor: "lightgrey" }}>
            <Grid>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Dropdown
                  placeholder="Select Make"
                  fluid
                  search
                  selection
                  value={value1}
                  options={this.state.make}
                  onChange={this.handleChange1}
                />
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Dropdown
                  placeholder="Select Model"
                  fluid
                  search
                  selection
                  value={value2}
                  options={this.state.model}
                  onChange={this.handleChange2}
                />
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Dropdown
                  placeholder="Select Year"
                  fluid
                  search
                  selection
                  value={value3}
                  options={this.state.model_year}
                  onChange={this.handleChange3}
                />
              </Grid.Column>
              <Grid.Column stretched mobile={16} tablet={8} computer={4}>
                <Button color="green" inverted onClick={this.filterResult}>
                  <Icon name="motorcycle" size="big" />
                  Suche
                </Button>
              </Grid.Column>

              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Dropdown
                  placeholder="Select Type"
                  fluid
                  search
                  selection
                  value={value4}
                  options={this.state.part_type}
                  onChange={this.handleChange4}
                />
              </Grid.Column>

              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Dropdown
                  placeholder="Select Category"
                  fluid
                  search
                  selection
                  value={value5}
                  options={this.state.part_category}
                  onChange={this.handleChange5}
                />
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Dropdown
                  placeholder="Select Part"
                  fluid
                  search
                  selection
                  value={value6}
                  options={this.state.name}
                  onChange={this.handleChange6}
                />
              </Grid.Column>
              <Grid.Column stretched mobile={16} tablet={8} computer={4}>
                <Button color="black" onClick={this.handleClear}>
                  <Icon name="x" />
                  Filter zurücksetzen
                </Button>
              </Grid.Column>
            </Grid>
          </Segment>
        </Responsive>

        {toggleStartPage && (
          // <Suspense fallback={<div>Loading</div>}>
          <Spring
            from={{ opacity: 0 }}
            to={{ opacity: 1 }}
            config={config.slow}
          >
            {(props) => (
              <animated.div style={props}>
                <ProductListFilterStartPage
                  data={this.state.data}
                  history={this.props.history}
                />
              </animated.div>
            )}
          </Spring>
          // </Suspense>
        )}
        {toggleResultPage && (
          <Suspense fallback={<div>Testing</div>}>
            <ProductListFilterResult
              filterResult={this.state.filterResultFromServer}
              history={this.props.history}
            />
          </Suspense>
        )}
      </Container>
    );
  }
}

export default ProductList;
