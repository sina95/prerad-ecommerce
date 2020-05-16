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
import { productListURL, addToCartURL, categoryListURL } from "../constants";
import { fetchCart } from "../store/actions/cart";
import { authAxios } from "../utils";
import { Link } from "react-router-dom";

class ProductList extends React.Component {
  state = {
    loading: false,
    error: null,
    data: [],
    category: [],
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(productListURL)
      .then((res) => {
        this.setState({ data: res.data, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
    axios.get(categoryListURL).then((res) => {
      this.setState({ category: res.data, loading: false });
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

  render() {
    const { data, error, loading } = this.state;
    var categoryDropdown = [];
    data.map((item) => {
      categoryDropdown.push({
        key: item.id,
        text: item.category,
        value: item.id,
      });
    });
    const unique = (data, column) => {
      const result = this.getUnique(data, column);
      return result;
    };
    console.log(data);
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
              <Button>Click Here</Button>{" "}
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Dropdown
                placeholder="Select Category"
                fluid
                search
                selection
                options={unique(data, "category").map((obj: any) => ({
                  key: obj.id,
                  text: obj.category,
                  value: obj.category,
                }))}
              />
            </Grid.Column>
            <Grid.Column>
              <Dropdown
                placeholder="Select Title"
                fluid
                search
                selection
                options={unique(data, "title").map((obj: any) => ({
                  key: obj.id,
                  text: obj.title,
                  value: obj.title,
                }))}
                onChange={this.changeTitle}
              />
            </Grid.Column>
            <Grid.Column>
              <Dropdown
                placeholder="Select Price"
                fluid
                search
                selection
                options={data.map((obj: any) => ({
                  key: obj.id,
                  text: obj.price,
                  value: obj.price,
                }))}
              />
            </Grid.Column>
            <Grid.Column>
              <Button>Click Here</Button>{" "}
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Item.Group divided>
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
                    {item.discount_price && (
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
