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
  Sidebar,
  Responsive,
} from "semantic-ui-react";
import { withRouter, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";
import { fetchCart } from "../store/actions/cart";

const NavBarMobile = ({
  children,
  onPusherClick,
  onToggle,
  visible,
  menuImage,
  authenticated,
  loading,
  cart,
  history,
  logout,
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
      <NavLink
        exact
        to="/"
        activeClassName="underlineCurrentPage"
        onClick={onToggle}
      >
        <Menu.Item header>PARTS</Menu.Item>
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
        {authenticated ? (
          <React.Fragment>
            <Menu.Menu position="right">
              <NavLink to="/profile" activeClassName="underlineCurrentPage">
                <Menu.Item>
                  Profil <Icon name="male" />
                </Menu.Item>
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
                        onClick={() => history.push("/order-summary")}
                      />
                    </React.Fragment>
                  ) : (
                    <Dropdown.Item>No items in your cart</Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
              <Menu.Item header onClick={() => logout()}>
                Logout <Icon name="log out" />
              </Menu.Item>
            </Menu.Menu>
          </React.Fragment>
        ) : (
          <Menu.Menu position="right">
            <NavLink to="/login" activeClassName="underlineCurrentPage">
              <Menu.Item>LOGIN</Menu.Item>
            </NavLink>
            <NavLink to="/signup" activeClassName="underlineCurrentPage">
              <Menu.Item>SIGNUP</Menu.Item>
            </NavLink>
          </Menu.Menu>
        )}
      </Menu>
      {children}
    </Sidebar.Pusher>
  </Sidebar.Pushable>
);

const NavBarDesktop = ({
  menuImage,
  authenticated,
  loading,
  cart,
  history,
  logout,
}) => (
  <Menu fixed="top" inverted>
    <Container>
      <Menu.Item>
        <Image size="tiny" src={menuImage} />
      </Menu.Item>
      <NavLink exact to="/" activeClassName="underlineCurrentPage">
        <Menu.Item header>PARTS</Menu.Item>
      </NavLink>
      {/* <Link to="/home">
              <Menu.Item header>Home</Menu.Item>
            </Link> */}
      {authenticated ? (
        <React.Fragment>
          <Menu.Menu position="right">
            <NavLink to="/profile" activeClassName="underlineCurrentPage">
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
                      onClick={() => history.push("/order-summary")}
                    />
                  </React.Fragment>
                ) : (
                  <Dropdown.Item>No items in your cart</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item header onClick={() => logout()}>
              Logout
            </Menu.Item>
          </Menu.Menu>
        </React.Fragment>
      ) : (
        <Menu.Menu position="right">
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
                    onClick={() => history.push("/order-summary")}
                  />
                </React.Fragment>
              ) : (
                <Dropdown.Item>No items in your cart</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>

          <NavLink to="/login" activeClassName="underlineCurrentPage">
            <Menu.Item header>LOGIN</Menu.Item>
          </NavLink>
          <NavLink to="/signup" activeClassName="underlineCurrentPage">
            <Menu.Item header>SIGNUP</Menu.Item>
          </NavLink>
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
    const { authenticated, cart, loading, history } = this.props;
    const menuImage =
      process.env.PUBLIC_URL + "/cropped-PRERAD-MOTORRAD-LOGO-1 150x24px.png";
    const { visible } = this.state;
    return (
      <div>
        <Responsive {...Responsive.onlyMobile}>
          <NavBarMobile
            onPusherClick={this.handlePusher}
            onToggle={this.handleToggle}
            visible={visible}
            menuImage={menuImage}
            authenticated={authenticated}
            cart={cart}
            loading={loading}
            history={history}
            logout={this.props.logout}
          >
            <NavBarChildren>{this.props.children}</NavBarChildren>
          </NavBarMobile>
        </Responsive>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <NavBarDesktop
            menuImage={menuImage}
            authenticated={authenticated}
            cart={cart}
            loading={loading}
            history={history}
            logout={this.props.logout}
          />
          <NavBarChildren>{this.props.children}</NavBarChildren>
        </Responsive>

        <Segment
          inverted
          vertical
          style={{ margin: "5em 0em 0em", padding: "5em 0em" }}
        >
          <Container textAlign="center">
            <Image
              centered
              size="small"
              src="/cropped-PRERAD-MOTORRAD-LOGO-1 150x24px.png"
            />
            <List horizontal inverted divided link size="small">
              <List.Item
                as="a"
                href="http://www.prerad.at/kontakt/"
                target="_blank"
              >
                Kontakt
              </List.Item>
            </List>
          </Container>
        </Segment>
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
