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
  Header,
  Icon,
  Menu,
  Sidebar,
  Button,
  Grid,
  GridColumn,
  Divider,
  Dropdown,
  Responsive,
  List,
} from "semantic-ui-react";
import {
  addToCartURL,
  productListURL,
  partFilterListURL,
  partTypeFilterListURL,
  partCategoryFilterListURL,
  partsFilterListURL,
} from "../constants";
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
    make: [],
    model: [],
    model_year: [],
    type: [],
    category: [],
    part: [],
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(partsFilterListURL)
      .then((res) => {
        const select_make =
          res.data.make &&
          res.data.make.map((obj: any) => ({
            key: obj.id,
            text: obj.make,
            value: JSON.stringify({ key: obj.id, value: obj.make }),
          }));

        const select_model =
          res.data.model &&
          res.data.model.map((obj: any) => ({
            key: obj.id,
            text: obj.model,
            parent: obj.make,
          }));

        const select_year =
          res.data.model_year &&
          res.data.model_year.map((obj: any) => ({
            key: obj.id,
            text: obj.year,
            value: obj.year,
          }));

        const select_part_type =
          res.data.part_types &&
          res.data.part_types.map((obj: any) => ({
            key: obj.id,
            text: obj.part_type,
            value: obj.part_type,
          }));

        const select_part_category =
          res.data.part_categorys &&
          res.data.part_categorys.map((obj: any) => ({
            key: obj.id,
            text: obj.category,
            value: obj.category,
          }));

        const select_part =
          res.data.parts &&
          res.data.parts.map((obj: any) => ({
            key: obj.id,
            text: obj.part,
            value: obj.part,
          }));

        this.setState({
          data: res.data,
          make: select_make,
          model: select_model,
          model_year: select_year,
          type: select_part_type,
          category: select_part_category,
          part: select_part,
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  }

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
    var selected_value = JSON.parse(value);
    console.log(value);
    this.setState({
      value1: value,
      model: this.model,
      model: this.state.model.filter(
        (parent) => parent.parent === selected_value.key
      ),
    });
  };
  // handleChange1 = (none, data) => {
  //   console.log(none.target);
  //   // this.setState({
  //   //   value1: data.value,
  //   //   model: this.state.model.filter((parent) => parent.parent === 1),
  //   // });
  // };

  handleChange2 = (none, data) => this.setState({ value2: data.value });
  handleChange3 = (none, data) => this.setState({ value3: data.value });
  handleChange4 = (none, data) => this.setState({ value4: data.value });
  handleChange5 = (none, data) => this.setState({ value5: data.value });
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

            {/* <Image src="/images/wireframe/short-paragraph.png" /> */}
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
                options={this.state.type}
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
                options={this.state.category}
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
                options={this.state.part}
                onChange={this.handleChange6}
              />
            </Grid.Column>
            <Grid.Column>
              <Button onClick={this.handleClear}>Filter zurücksetzen</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {/* <Item.Group divided>
          {data.map((item) => {
            return (
              <Item key={item.id}>
                <Item.Image src={item.image} />
                <Item.Content>
                  <Item.Header
                    as="a"
                    onClick={() =>
                      this.props.history.push(`/products/${item.id}`)
                    }
                  >
                    {item.title}
                  </Item.Header>
                  <Item.Meta>
                    <span className="cinema">{item.category}</span>
                  </Item.Meta>
                  <Item.Description>{item.Description}</Item.Description>
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
        {/* {item.discount_price && (
                      <Label
                        color={
                          item.label === "primary"
                            ? "blue"
                            : item.label === "secondary"
                            ? "green"
                            : "red"
                        }
                      >
                        Reduzierter Preis{" "}
                        {this.discountPrice(item.price, item.discount_price)} €
                      </Label>
                    )}
                  </Item.Extra>
                </Item.Content>
              </Item>
            );
          })}
        </Item.Group> */}{" "}
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
