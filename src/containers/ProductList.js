import React from "react";
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
import ProductListFilterResult from "./ProductListFilterResult";

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
      part: [],
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
              <Loader inverted>Loading</Loader>
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
                  options={this.state.part}
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
                  options={this.state.part}
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
                  options={this.state.part}
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
          <ProductListFilterStartPage
            data={this.state.data}
            history={this.props.history}
          />
        )}
        {toggleResultPage && (
          <ProductListFilterResult
            filterResult={this.state.filterResultFromServer}
            history={this.props.history}
          />
        )}
      </Container>
    );
  }
}

export default ProductList;
