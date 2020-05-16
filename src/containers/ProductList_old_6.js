import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import {
  Container,
  Dimmer,
  Image,
  Item,
  Label,
  Loader,
  Message,
  Segment,
  Button,
  Grid,
  Dropdown,
} from "semantic-ui-react";
import { addToCartURL, partsFilterListURL, localhost } from "../constants";
import { fetchCart } from "../store/actions/cart";
import { authAxios } from "../utils";
import { Link } from "react-router-dom";

class ProductList extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.handleChange1 = this.handleChange1.bind(this);
  // }
  state = {
    loading: false,
    error: null,
    data: [],
    value1: "",
    value2: "",
    value3: "",
    value4: "",
    value5: "",
    value6: "",
    drop: {
      make: [],
      model: [],
      model_year: [],
      part_types: [],
      part_categorys: [],
      parts: [],
    },
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
  }

  // populateDropdown = (data) => {
  //   // var dropJson = {};
  //   Object.keys(this.state.drop).map((key) =>
  //     this.setState({
  //       [key]: data[key],
  //     })
  //   );
  // };

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

  handleAddToCart = (slug) => {
    this.setState({ loading: true });
    authAxios()
      .post(addToCartURL, { slug })
      .then((res) => {
        this.props.refreshCart();
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };
  discountPrice = (price, discount_price) => {
    var sumPrice = price - discount_price;
    return sumPrice;
  };

  changeTitle = (event) => {
    console.log(event);
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
        category[item] = val[index];
      });
    }
    this.setState({ [cat]: category });
  }

  handleClear = (e) => {
    this.setState({
      value1: "",
      value2: "",
      value3: "",
      value4: "",
      value5: "",
      value6: "",
    });
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
    const selectedArray = "part_categorys";
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
    const selectedArray = "parts";
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
      data,
      error,
      loading,
      value1,
      value2,
      value3,
      value4,
      value5,
      value6,
    } = this.state;

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
        <Grid columns={4} divided>
          <Grid.Row>
            <Grid.Column>
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
            <Grid.Column>
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
            <Grid.Column>
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
            <Grid.Column>
              <Button>Suche</Button>{" "}
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Dropdown
                placeholder="Select Type"
                fluid
                search
                selection
                value={value4}
                options={this.state.part_types}
                onChange={this.handleChange4}
              />
            </Grid.Column>

            <Grid.Column>
              <Dropdown
                placeholder="Select Category"
                fluid
                search
                selection
                value={value5}
                options={this.state.part_categorys}
                onChange={this.handleChange5}
              />
            </Grid.Column>
            <Grid.Column>
              <Dropdown
                placeholder="Select Part"
                fluid
                search
                selection
                value={value6}
                options={this.state.parts}
                onChange={this.handleChange6}
              />
            </Grid.Column>
            <Grid.Column>
              <Button onClick={this.handleClear}>Filter zurücksetzen</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Item.Group divided>
          {data.last_four_used &&
            data.last_four_used.map((item) => {
              return (
                <Item key={item.id}>
                  <Item.Image
                    src={
                      item.image && item.image.length
                        ? localhost + item.image[0].image
                        : localhost +
                          "/media/yamaha-yzf-r1-slika-126439343_oaR4C4j.jpg"
                    }
                  />
                  <Item.Content>
                    <Item.Header
                      as="a"
                      onClick={() =>
                        this.props.history.push(`/products/${item.id}`)
                      }
                    >
                      {item.label}
                    </Item.Header>
                    <Item.Meta>
                      <span className="cinema">{item.label}</span>
                    </Item.Meta>
                    <Item.Description>{item.description}</Item.Description>
                    <Item.Meta>
                      <span className="price">{item.price} €</span>
                    </Item.Meta>
                    <Item.Extra>
                      {/* <Button
                        primary
                        floated="right"
                        icon
                        labelPosition="right"
                        onClick={() => this.handleAddToCart(item.slug)}
                      >
                        Add to cart
                        <Icon name="cart plus" />
                      </Button> */}
                      {item.discount_price && (
                        <Label
                          color={
                            item.label === "U"
                              ? "blue"
                              : item.label === "N"
                              ? "red"
                              : "green"
                          }
                        >
                          Reduzierter Preis{" "}
                          {this.discountPrice(item.price, item.discount_price)}{" "}
                          €
                        </Label>
                      )}
                    </Item.Extra>
                  </Item.Content>
                </Item>
              );
            })}
        </Item.Group>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    refreshCart: () => dispatch(fetchCart()),
  };
};

export default connect(null, mapDispatchToProps)(ProductList);
