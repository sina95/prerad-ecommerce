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
import PartFilter from "./PartFilter";

class ProductList extends React.Component {
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
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(partsFilterListURL)
      .then((res) => {
        this.setState({ data: res.data, loading: false });
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

  handleChange1 = (none, data) => this.setState({ value1: data.value });
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
    const { make, model, model_year, part_types, part_categorys, parts } = data;

    const select_make =
      make &&
      make.map((obj: any) => ({
        key: obj.id,
        text: obj.make,
        value: obj.make,
      }));

    const select_model =
      model &&
      model.map((obj: any) => ({
        key: obj.id,
        text: obj.model,
        value: obj.model,
      }));

    const select_year =
      model_year &&
      model_year.map((obj: any) => ({
        key: obj.id,
        text: obj.year,
        value: obj.year,
      }));

    const select_part_type =
      part_types &&
      part_types.map((obj: any) => ({
        key: obj.id,
        text: obj.part_type,
        value: obj.part_type,
      }));

    const select_part_category =
      part_categorys &&
      part_categorys.map((obj: any) => ({
        key: obj.id,
        text: obj.category,
        value: obj.category,
      }));

    const select_part =
      parts &&
      parts.map((obj: any) => ({
        key: obj.id,
        text: obj.part,
        value: obj.part,
      }));

    // var categoryDropdown = [];
    // data.map((item) => {
    //   categoryDropdown.push({
    //     key: item.id,
    //     text: item.category,
    //     value: item.id,
    //   });
    // });
    // const unique = (data, column) => {
    //   const result = this.getUnique(data, column);
    //   return result;
    // };
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
        <PartFilter />
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
