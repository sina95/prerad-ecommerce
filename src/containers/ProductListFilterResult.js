import React from "react";
import {
  Item,
  Label,
  Button,
  Grid,
  GridColumn,
  Icon,
  Rating,
  Pagination,
  Container,
  Segment,
} from "semantic-ui-react";
import { localhost } from "../constants";
import { authAxios } from "../utils";
import { addToCartURL } from "../constants";
import { fetchCart } from "../store/actions/cart";
import { connect } from "react-redux";
import axios from "axios";

class ProductListFilterResult extends React.Component {
  handleAddToCart = (slug) => {
    this.setState({ loading: true });
    authAxios()
      .post(addToCartURL, { slug })
      .then((res) => {
        // this.props.refreshCart();
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };
  render() {
    const { filterResult } = this.props;
    return (
      <Segment>
        <Grid stretched>
          {filterResult &&
            filterResult.map((item) => {
              return (
                <Grid.Column mobile={16} tablet={8} computer={4}>
                  <Segment raised>
                    <Item
                      key={item.id}
                      style={
                        item.label !== "New"
                          ? { marginTop: "40px" }
                          : { marginTop: "" }
                      }
                    >
                      <Grid>
                        <Grid.Row>
                          {item.label === "New" ? (
                            <Label ribbon="right" color="red" size="big">
                              New
                            </Label>
                          ) : (
                            ""
                          )}
                          <Item.Image
                            size="big"
                            centered="True"
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
                            <Item.Header
                              textAlign="center"
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
                                onClick={() => this.handleAddToCart(item.slug)}
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
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Item>
                  </Segment>
                </Grid.Column>
              );
            })}
        </Grid>
        <Container
          fluid
          centered
          textAlign="center"
          style={{ padding: "2rem" }}
        >
          <Pagination defaultActivePage={1} totalPages={10} />
        </Container>
      </Segment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    refreshCart: () => dispatch(fetchCart()),
  };
};

export default connect(null, mapDispatchToProps)(ProductListFilterResult);
