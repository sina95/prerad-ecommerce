import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import {
  Button,
  Container,
  Dimmer,
  Grid,
  Header,
  Icon,
  Image,
  Item,
  Loader,
  Message,
  Segment,
  Modal,
  Rating,
  Breadcrumb,
  Divider,
} from "semantic-ui-react";
import { productDetailURL, addToCartURL, localhost } from "../constants";
import { fetchCart } from "../store/actions/cart";
import { authAxios } from "../utils";
import ImageZoom from "./ImageZoom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import _ from "lodash";
import { NavLink } from "react-router-dom";

class ProductDetail extends React.Component {
  state = {
    loading: false,
    error: null,
    formVisible: false,
    data: {},
    formData: {},
    imageZoom: {
      imageModalOpen: false,
      selectedImage: "",
      autoplayCarousel: true,
    },
    rating: 1,
    test: [1, 1, 2, 5],
  };

  componentDidMount() {
    this.handleFetchItem();
  }

  handleToggleForm = () => {
    const { formVisible } = this.state;
    this.setState({
      formVisible: !formVisible,
    });
  };

  handleImageZoomOpen = (index) =>
    this.setState(
      { selectedImage: localhost + this.state.data.image[index].image },
      () => {
        this.setState({ imageModalOpen: true, autoplayCarousel: false });
      }
    );

  handleImageZoomClose = () => this.setState({ imageModalOpen: false });

  handleFetchItem = () => {
    const {
      match: { params },
    } = this.props;
    this.setState({ loading: true });
    axios
      .get(productDetailURL(params.productID))
      .then((res) => {
        this.setState({ data: res.data, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleFormatData = (formData) => {
    // convert {colour: 1, size: 2} to [1,2] - they're all variations
    return Object.keys(formData).map((key) => {
      return formData[key];
    });
  };

  handleAddToCart = (slug) => {
    this.setState({ loading: true });
    const { formData } = this.state;
    const variations = this.handleFormatData(formData);
    authAxios()
      .post(addToCartURL, { slug, variations })
      .then((res) => {
        this.props.refreshCart();
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleChange = (e, { name, value }) => {
    const { formData } = this.state;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    this.setState({ formData: updatedFormData });
  };

  discountPrice = (price, discount_price) => {
    var sumPrice = price - discount_price;
    return sumPrice;
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
    const {
      data,
      error,
      formData,
      formVisible,
      loading,
      selectedImage,
      autoplayCarousel,
    } = this.state;
    const item = data;

    const unique = [
      ...new Set(
        data.model_year &&
          data.model_year.map(
            (item) => item.model.make.make + " " + item.model.model
          )
      ),
    ];

    return (
      <Container>
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

        <Grid columns={2} divided="vertically">
          <Grid.Row>
            <Header as="h1">
              {data.part && data.part.part} {_.map(unique, (item) => item)}
            </Header>
          </Grid.Row>
          <Breadcrumb>
            <Breadcrumb.Section>
              <NavLink exact to="/">
                <Icon name="home" size="large" color="black" />
              </NavLink>
            </Breadcrumb.Section>
            {/* <Breadcrumb.Divider icon="right chevron" /> */}
            <Breadcrumb.Divider icon="right arrow" />
            <Breadcrumb.Section active>{data.id}</Breadcrumb.Section>
          </Breadcrumb>
          <br /> <br />
          <Grid.Row>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              {/* <Segment>
                <ImageZoom />
              </Segment> */}
              <Segment style={{ borderWidth: "3px", borderColor: "black" }}>
                <Carousel
                  autoPlay
                  dynamicHeight={true}
                  infiniteLoop
                  showStatus={false}
                  onClickItem={(index: number) =>
                    this.handleImageZoomOpen(index)
                  }
                >
                  {data.image &&
                    data.image.map((value, index) => {
                      return (
                        <Segment
                          style={{ borderWidth: "0px", cursor: "zoom-in" }}
                          key={index}
                        >
                          {/* <Label as="a" color="red" corner="left" icon="zoom" /> */}
                          {/* <p className="legend">Click on image for zoom view</p> */}
                          <img
                            alt={data.part.part}
                            src={localhost + value.image}
                            key={index}
                          />
                          {/* <ImageZoom image={localhost + value.image} /> */}
                        </Segment>
                      );
                    })}
                </Carousel>
                <Modal
                  open={this.state.imageModalOpen}
                  onClose={this.handleImageZoomClose}
                  basic
                  size="large"
                >
                  <Modal.Content>
                    <Segment>
                      {/* <Image size="big" src={selectedImage} /> */}
                      <ImageZoom image={selectedImage} />
                    </Segment>
                  </Modal.Content>
                </Modal>
              </Segment>
            </Grid.Column>

            <Grid.Column>
              <Grid as={Item}>
                <Grid.Row>
                  <Grid.Column
                    width={8}
                    textAlign="center"
                    verticalAlign="middle"
                  >
                    {data.discount_price && data.discount_price ? (
                      <Grid.Row>
                        <Grid.Row>
                          <Item.Header>
                            <del>Price: €{data.price}</del>
                          </Item.Header>
                        </Grid.Row>
                        <Grid.Row>
                          <Item.Header as="h1">
                            Discount price: €{data.discount_price}
                          </Item.Header>
                        </Grid.Row>
                      </Grid.Row>
                    ) : (
                      <Grid.Row>
                        <Item.Header as="h4">Price: €{data.price}</Item.Header>
                      </Grid.Row>
                    )}
                  </Grid.Column>
                  <Grid.Column
                    width={8}
                    textAlign="center"
                    verticalAlign="middle"
                  >
                    <Button
                      size="big"
                      positive
                      onClick={() => this.handleAddToCart(item.slug)}
                    >
                      <Icon name="shopping cart" />
                      Add to cart
                    </Button>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column
                    width={5}
                    textAlign="left"
                    verticalAlign="middle"
                  >
                    <Item.Meta>
                      <span className="price">In stock:</span>
                    </Item.Meta>
                  </Grid.Column>
                  <Grid.Column
                    width={11}
                    textAlign="left"
                    verticalAlign="middle"
                  >
                    <Item.Content>
                      <Icon name="check circle" color="green" />
                      Yes
                    </Item.Content>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column
                    width={5}
                    textAlign="left"
                    verticalAlign="middle"
                  >
                    <Item.Content>Delivery:</Item.Content>
                  </Grid.Column>
                  <Grid.Column
                    width={11}
                    textAlign="left"
                    verticalAlign="middle"
                  >
                    <Item.Content>
                      <Icon name="shipping fast" color="red" />
                      Mo 18 May - Th 21 May
                    </Item.Content>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column
                    width={5}
                    textAlign="left"
                    verticalAlign="middle"
                  >
                    <Item.Content>Shipping cost:</Item.Content>
                  </Grid.Column>
                  <Grid.Column
                    width={11}
                    textAlign="left"
                    verticalAlign="middle"
                  >
                    <Item.Content>€&nbsp;10</Item.Content>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row textAlign="center" verticalAlign="middle">
                  <Grid.Column width="16">
                    <Icon className="base64paypal" size="huge" /> &nbsp;
                    <Icon className="base64mastercard" size="huge" /> &nbsp;
                    <Icon className="base64visa" size="huge" /> &nbsp;
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row
                  as={Segment}
                  style={{ backgroundColor: "rgb(236,236,222)" }}
                >
                  <Item style={{ marginLeft: "10px" }}>
                    <Item.Content>
                      <Item.Description>
                        <Header as="h4">Description:</Header>
                        {data.description}
                      </Item.Description>
                      <br />
                      <Item.Description>
                        <Header as="h4">Year range:</Header>
                        2010
                      </Item.Description>
                      <br />
                      <Item.Description>
                        <Header as="h4">Item number:</Header>
                        {data.id}
                      </Item.Description>
                      <br />
                      <Item.Description>
                        <Header as="h4">Info:</Header>
                        {data.info}
                      </Item.Description>
                      <br />
                      <Item.Description>
                        <Header as="h4">State:</Header>
                        {data.state}
                      </Item.Description>
                      <Rating
                        icon="star"
                        rating={data.part_rating}
                        maxRating={5}
                        disabled
                      />
                    </Item.Content>
                  </Item>
                </Grid.Row>

                {data.variations &&
                  data.variations.map((v) => {
                    return (
                      <React.Fragment key={v.id}>
                        <Header as="h3">{v.name}</Header>
                        <Item.Group divided>
                          {v.item_variations.map((iv) => {
                            return (
                              <Item key={iv.id}>
                                {iv.attachment && (
                                  <Item.Image
                                    size="tiny"
                                    src={`http://127.0.0.1:8000${iv.attachment}`}
                                  />
                                )}
                                <Item.Content verticalAlign="middle">
                                  {iv.value}
                                </Item.Content>
                              </Item>
                            );
                          })}
                        </Item.Group>
                      </React.Fragment>
                    );
                  })}
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    refreshCart: () => dispatch(fetchCart()),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(ProductDetail));
