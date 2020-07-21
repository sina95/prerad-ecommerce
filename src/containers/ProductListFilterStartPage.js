import React from "react";
import {
  Container,
  Image,
  Item,
  Label,
  Button,
  Grid,
  GridColumn,
  Icon,
  Rating,
  Segment,
  Header,
} from "semantic-ui-react";
import { localhost } from "../constants";
import { authAxios } from "../utils";
import { addToCartURL } from "../constants";
import { fetchCart, addToCart } from "../store/actions/cart";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class ProductListFilterStartPage extends React.Component {
  // handleAddToCart = (slug) => {
  //   this.setState({ loading: true });
  //   authAxios()
  //     .post(addToCartURL, { slug })
  //     .then((res) => {
  //       // this.props.refreshCart();
  //       this.setState({ loading: false });
  //     })
  //     .catch((err) => {
  //       this.setState({ error: err, loading: false });
  //     });
  // };

  handleAddToCart = (e, item) => {
    e.stopPropagation();
    this.setState({ loading: true });
    this.props.addToCart(item);
  };

  render() {
    const { data } = this.props;
    return (
      <Segment>
        <Grid divided>
          {/* <Grid.Row> */}
          {data.last_four_used &&
            data.last_four_used.map((item, index) => {
              return (
                <Grid.Column mobile={16} tablet={8} computer={4} key={index}>
                  <Segment raised>
                    <Item key={item.id}>
                      <Grid>
                        <Grid.Row>
                          <Item.Image
                            size="big"
                            centered
                            src={
                              item.image && item.image.length
                                ? localhost + item.image[0].image
                                : localhost +
                                  "/media/yamaha-yzf-r1-slika-126439343_oaR4C4j.jpg"
                            }
                          />
                        </Grid.Row>
                        <Grid.Row>
                          <Grid.Column width={8}>
                            <Link to="/" />
                            <Item.Header as={Link} to={`/products/${item.id}`}>
                              {item.label}
                            </Item.Header>
                          </Grid.Column>
                          <GridColumn width={8} textAlign="center">
                            <Item.Meta>
                              <span className="price">{item.price} €</span>
                            </Item.Meta>
                          </GridColumn>
                        </Grid.Row>
                        <Grid.Row>
                          <Grid.Column width={8}>
                            <Rating
                              icon="star"
                              rating={item.part_rating}
                              maxRating={5}
                              disabled
                            />
                          </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                          <Grid.Column>
                            <Item.Meta>
                              <span className="cinema">{item.state}</span>
                            </Item.Meta>
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                          <Grid.Column width={16}>
                            <Button.Group fluid>
                              <Button
                                animated="vertical"
                                onClick={(e) => this.handleAddToCart(e, item)}
                              >
                                <Button.Content hidden>
                                  Add to cart
                                </Button.Content>
                                <Button.Content visible>
                                  <Icon name="shop" size="large" />
                                </Button.Content>
                              </Button>
                              <Button.Or text="<>" />
                              <Button
                                onClick={() =>
                                  this.props.history.push(
                                    `/products/${item.id}`
                                  )
                                }
                                positive
                                animated="fade"
                              >
                                <Button.Content visible>
                                  <Icon name="search" />
                                </Button.Content>
                                <Button.Content hidden>Show</Button.Content>
                              </Button>
                            </Button.Group>
                            {/* <GridColumn width={8}>
                          <Button
                            primary
                            floated="right"
                            icon
                            labelPosition="right"
                            onClick={() => this.handleAddToCart(item.slug)}
                          >
                            Add to cart
                            <Icon name="cart plus" />
                          </Button>
                        </GridColumn>
                        <GridColumn width={8}>
                          <Button
                            primary
                            floated="right"
                            icon
                            labelPosition="right"
                            onClick={() =>
                              this.props.history.push(`/products/${item.id}`)
                            }
                          >
                            Show item
                            <Icon name="cart plus" />
                          </Button>
                        </GridColumn> */}
                          </Grid.Column>
                        </Grid.Row>
                        {/* <Item.Meta>
                        <span className="cinema">{item.label}</span>
                      </Item.Meta> */}
                        {/* <Item.Description>{item.description}</Item.Description> */}

                        {/* <Item.Extra> */}
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
                              item.label === "U"
                                ? "blue"
                                : item.label === "N"
                                ? "red"
                                : "green"
                            }
                          >
                            Reduzierter Preis{" "}
                            {this.discountPrice(
                              item.price,
                              item.discount_price
                            )}{" "}
                            €
                          </Label>
                        )}
                      </Item.Extra> */}
                      </Grid>
                    </Item>
                  </Segment>
                </Grid.Column>
              );
            })}
          {/* </Grid.Row> */}
        </Grid>
        <Segment raised style={{ marginBottom: "2rem" }}>
          <Grid columns={2} textAlign="center">
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <Grid stretched>
                <Grid.Column>
                  <Grid.Row>
                    <Label color="red" key="red">
                      We are PRERAD.
                    </Label>
                  </Grid.Row>
                  <Grid.Row>
                    <Label color="red" key="red">
                      We have parts
                    </Label>
                  </Grid.Row>
                  <Grid.Row>
                    <Label color="red" key="red">
                      We have service
                    </Label>
                  </Grid.Row>
                  <Grid.Row>
                    <Label color="red" key="red">
                      We have vehicles
                    </Label>
                  </Grid.Row>
                  <Grid.Row>
                    <Label color="red" key="red">
                      We driving
                    </Label>
                  </Grid.Row>
                  <Grid.Row>
                    <Label color="red" key="red">
                      We are PRERAD
                    </Label>
                  </Grid.Row>
                  <Grid.Row>
                    <Label color="red" key="red">
                      We keep you rolling
                    </Label>
                  </Grid.Row>
                  <Grid.Row>
                    <Label color="red" key="red">
                      Contact us
                    </Label>
                  </Grid.Row>
                  <Grid.Row>
                    <Label color="red" key="red">
                      We are there for you
                    </Label>
                  </Grid.Row>
                  <Grid.Row>
                    <Label color="red" key="red">
                      See you again
                    </Label>
                  </Grid.Row>
                </Grid.Column>
              </Grid>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <Container fluid>
                <Image
                  // centered
                  bordered
                  rounded
                  size="medium"
                  src={process.env.PUBLIC_URL + "/prepad_parts_covert.jpg"}
                />
              </Container>
            </Grid.Column>
          </Grid>
        </Segment>
        <Grid divided>
          {/* <Grid.Row> */}
          {data.last_four_new &&
            data.last_four_new.map((item, index) => {
              return (
                <Grid.Column mobile={16} tablet={8} computer={4} key={index}>
                  <Segment raised>
                    <Item key={item.id}>
                      <Grid>
                        <Grid.Row>
                          {/* <Segment raised> */}
                          {item.label === "N" ? (
                            <Label ribbon="right" color="red" size="big">
                              New
                            </Label>
                          ) : (
                            ""
                          )}
                          <Item.Image
                            size="big"
                            centered
                            src={
                              item.image && item.image.length
                                ? localhost + item.image[0].image
                                : localhost +
                                  "/media/yamaha-yzf-r1-slika-126439343_oaR4C4j.jpg"
                            }
                          />
                          {/* </Segment> */}
                        </Grid.Row>
                        <Grid.Row>
                          <Grid.Column width={8}>
                            <Item.Header
                              as="a"
                              onClick={() =>
                                this.props.history.push(`/products/${item.id}`)
                              }
                            >
                              {item.label}
                            </Item.Header>
                          </Grid.Column>
                          <GridColumn width={8} textAlign="center">
                            <Item.Meta>
                              <span className="price">{item.price} €</span>
                            </Item.Meta>
                          </GridColumn>
                        </Grid.Row>

                        <Grid.Row>
                          <Grid.Column>
                            <Item.Meta>
                              <span className="cinema">{item.state}</span>
                            </Item.Meta>
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                          <Grid.Column width={8}>
                            <Rating
                              icon="star"
                              rating={item.part_rating}
                              maxRating={5}
                              disabled
                            />
                          </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                          <Grid.Column width={16}>
                            <Button.Group fluid>
                              <Button
                                animated="vertical"
                                onClick={(e) => this.handleAddToCart(e, item)}
                              >
                                <Button.Content hidden>
                                  Add to cart
                                </Button.Content>
                                <Button.Content visible>
                                  <Icon name="shop" size="large" />
                                </Button.Content>
                              </Button>
                              <Button.Or text="<>" />
                              <Button
                                positive
                                animated="fade"
                                onClick={() =>
                                  this.props.history.push(
                                    `/products/${item.id}`
                                  )
                                }
                              >
                                <Button.Content visible>
                                  <Icon name="search" />
                                </Button.Content>
                                <Button.Content hidden>Show</Button.Content>
                              </Button>
                            </Button.Group>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Item>
                  </Segment>
                </Grid.Column>
              );
            })}
        </Grid>
      </Segment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    refreshCart: () => dispatch(fetchCart()),
    addToCart: (item) => dispatch(addToCart(item)),
  };
};

export default connect(null, mapDispatchToProps)(ProductListFilterStartPage);
