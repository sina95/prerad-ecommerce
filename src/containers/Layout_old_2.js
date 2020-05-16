import React from "react";
import {
  Container,
  // Divider,
  Dropdown,
  // Grid,
  // Header,
  Image,
  List,
  Menu,
  Segment,
  Icon,
} from "semantic-ui-react";
import { Link, withRouter, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";
import { fetchCart } from "../store/actions/cart";
import Navbar from "./Navbar";

const NavBarMobile = ({
  children,
  leftItems,
  onPusherClick,
  onToggle,
  rightItems,
  visible,
  menuImage,
}) => (
  <Sidebar.Pushable>
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      inverted
      vertical
      visible={visible}
    >
      {_.map(leftItems, (item) => (
        <NavLink exact to={item.link} activeClassName="test">
          <Menu.Item {...item.item} />
        </NavLink>
      ))}
    </Sidebar>
    <Sidebar.Pusher
      dimmed={visible}
      onClick={onPusherClick}
      style={{ minHeight: "100vh" }}
    >
      <Menu fixed="top" inverted>
        <Menu.Item>
          <Image size="tiny" src={menuImage} />
        </Menu.Item>
        <Menu.Item onClick={onToggle}>
          <Icon name="sidebar" />
        </Menu.Item>
        <Menu.Menu position="right">
          {_.map(rightItems, (item) => (
            <Menu.Item {...item} />
          ))}
        </Menu.Menu>
      </Menu>
      {children}
    </Sidebar.Pusher>
  </Sidebar.Pushable>
);

const NavBarDesktop = ({ leftItems, rightItems, menuImage, authenticated }) => (
  <Menu fixed="top" inverted>
    <Container>
      <Menu.Item>
        <Image size="tiny" src={menuImage} />
      </Menu.Item>
      <NavLink exact to="/" activeClassName="test">
        <Menu.Item header>PARTS</Menu.Item>
      </NavLink>
      {/* <Link to="/home">
              <Menu.Item header>Home</Menu.Item>
            </Link> */}
      {authenticated ? (
        <React.Fragment>
          <Menu.Menu position="right">
            <NavLink to="/profile">
              <Menu.Item>Profil</Menu.Item>
            </NavLink>
            <Dropdown
              icon="cart"
              loading={loading}
              text={`${cart !== null ? cart.order_items.length : 0}`}
              pointing
              className="link item"
            >
              <Dropdown.Menu>
                {cart !== null ? (
                  <React.Fragment>
                    {cart.order_items.map((order_item) => {
                      return (
                        <Dropdown.Item key={order_item.id}>
                          {order_item.quantity} x {order_item.item.title}
                        </Dropdown.Item>
                      );
                    })}
                    {cart.order_items.length < 1 ? (
                      <Dropdown.Item>
                        Keine Artikel in Ihrem Warenkorb
                      </Dropdown.Item>
                    ) : null}
                    <Dropdown.Divider />

                    <Dropdown.Item
                      icon="arrow right"
                      text="Checkout"
                      onClick={() => this.props.history.push("/order-summary")}
                    />
                  </React.Fragment>
                ) : (
                  <Dropdown.Item>No items in your cart</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item header onClick={() => this.props.logout()}>
              Logout
            </Menu.Item>
          </Menu.Menu>
        </React.Fragment>
      ) : (
        <Menu.Menu position="right">
          <Link to="/login">
            <Menu.Item header>Login</Menu.Item>
          </Link>
          <Link to="/signup">
            <Menu.Item header>Signup</Menu.Item>
          </Link>
        </Menu.Menu>
      )}
    </Container>
  </Menu>
);

const NavBarChildren = ({ children }) => (
  <Container style={{ marginTop: "5em" }}>{children}</Container>
);

class CustomLayout extends React.Component {
  componentDidMount() {
    this.props.fetchCart();
  }

  state = {
    visible: false,
  };

  handlePusher = () => {
    const { visible } = this.state;

    if (visible) this.setState({ visible: false });
  };

  handleToggle = () => this.setState({ visible: !this.state.visible });

  render() {
    const { authenticated, cart, loading } = this.props;
    const leftItems = [
      { item: { as: "a", content: "PARTS", key: "part" }, link: "/" },
    ];
    const rightItems = [
      { item: { as: "a", content: "LOGIN", key: "part" }, link: "/" },
      { item: { as: "a", content: "REGISTER", key: "part" }, link: "/" },
    ];
    const menuImage =
      process.env.PUBLIC_URL + "/cropped-PRERAD-MOTORRAD-LOGO-1 150x24px.png";

    return (
      <div>
        <Navbar
          leftItems={leftItems}
          rightItems={rightItems}
          menuImage={menuImage}
          authenticated={authenticated}
        >
          <Menu>
            <Container>
              {/* <Link to="/">
              <Menu.Item header>Home</Menu.Item>
            </Link> */}
              <Menu.Item header>
                <Image
                  size="tiny"
                  src={
                    process.env.PUBLIC_URL +
                    "/cropped-PRERAD-MOTORRAD-LOGO-1 150x24px.png"
                  }
                />
              </Menu.Item>

              <NavLink exact to="/" activeClassName="test">
                <Menu.Item header>PARTS</Menu.Item>
              </NavLink>
              {/* <Link to="/home">
              <Menu.Item header>Home</Menu.Item>
            </Link> */}
              {authenticated ? (
                <React.Fragment>
                  <Menu.Menu position="right">
                    <Link to="/profile">
                      <Menu.Item>Profil</Menu.Item>
                    </Link>
                    <Dropdown
                      icon="cart"
                      loading={loading}
                      text={`${cart !== null ? cart.order_items.length : 0}`}
                      pointing
                      className="link item"
                    >
                      <Dropdown.Menu>
                        {cart !== null ? (
                          <React.Fragment>
                            {cart.order_items.map((order_item) => {
                              return (
                                <Dropdown.Item key={order_item.id}>
                                  {order_item.quantity} x{" "}
                                  {order_item.item.title}
                                </Dropdown.Item>
                              );
                            })}
                            {cart.order_items.length < 1 ? (
                              <Dropdown.Item>
                                Keine Artikel in Ihrem Warenkorb
                              </Dropdown.Item>
                            ) : null}
                            <Dropdown.Divider />

                            <Dropdown.Item
                              icon="arrow right"
                              text="Checkout"
                              onClick={() =>
                                this.props.history.push("/order-summary")
                              }
                            />
                          </React.Fragment>
                        ) : (
                          <Dropdown.Item>No items in your cart</Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Item header onClick={() => this.props.logout()}>
                      Logout
                    </Menu.Item>
                  </Menu.Menu>
                </React.Fragment>
              ) : (
                <Menu.Menu position="right">
                  <Link to="/login">
                    <Menu.Item header>Login</Menu.Item>
                  </Link>
                  <Link to="/signup">
                    <Menu.Item header>Signup</Menu.Item>
                  </Link>
                </Menu.Menu>
              )}
            </Container>
          </Menu>

          {this.props.children}

          <Segment
            inverted
            vertical
            style={{ margin: "5em 0em 0em", padding: "5em 0em" }}
          >
            <Container>
              {/* <Grid divided inverted stackable>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Group 1" />
                <List link inverted>
                  <List.Item as="a">Link One</List.Item>
                  <List.Item as="a">Link Two</List.Item>
                  <List.Item as="a">Link Three</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Group 2" />
                <List link inverted>
                  <List.Item as="a">Link One</List.Item>
                  <List.Item as="a">Link Two</List.Item>
                  <List.Item as="a">Link Three</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Group 3" />
                <List link inverted>
                  <List.Item as="a">Link One</List.Item>
                  <List.Item as="a">Link Two</List.Item>
                  <List.Item as="a">Link Three</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={7}>
                <Header inverted as="h4" content="Footer Header" />
                <p>
                  Extra space for a call to action inside the footer that could
                  help re-engage users.
                </p>
              </Grid.Column>
            </Grid> */}

              {/* <Divider inverted section /> */}
              <Image
                centered
                size="small"
                src="/cropped-PRERAD-MOTORRAD-LOGO-1 150x24px.png"
              />
              <List horizontal inverted divided link size="small">
                {/* <List.Item as="a" href="#">
                Site Map
              </List.Item> */}
                <List.Item
                  as="a"
                  href="http://www.prerad.at/kontakt/"
                  target="_blank"
                >
                  Kontakt
                </List.Item>
                {/* <List.Item as="a" href="#">
                Terms and Conditions
              </List.Item>
              <List.Item as="a" href="#">
                Privacy Policy
              </List.Item> */}
              </List>
            </Container>
          </Segment>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
    loading: state.cart.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    fetchCart: () => dispatch(fetchCart()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CustomLayout)
);
