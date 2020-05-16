import _ from "lodash";
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Container,
  Icon,
  Image,
  Menu,
  Sidebar,
  Responsive,
  Dropdown,
} from "semantic-ui-react";

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

class Navbar extends React.Component {
  state = {
    visible: false,
  };

  handlePusher = () => {
    const { visible } = this.state;

    if (visible) this.setState({ visible: false });
  };

  handleToggle = () => this.setState({ visible: !this.state.visible });

  render() {
    const {
      children,
      leftItems,
      rightItems,
      menuImage,
      authenticated,
    } = this.props;
    const { visible } = this.state;
    // console.log(rightItems);

    return (
      <React.Fragment>
        <Responsive {...Responsive.onlyMobile}>
          <NavBarMobile
            leftItems={leftItems}
            onPusherClick={this.handlePusher}
            onToggle={this.handleToggle}
            rightItems={rightItems}
            visible={visible}
            menuImage={menuImage}
            authenticated={authenticated}
          >
            <NavBarChildren>{children}</NavBarChildren>
          </NavBarMobile>
        </Responsive>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <NavBarDesktop
            leftItems={leftItems}
            rightItems={rightItems}
            menuImage={menuImage}
            authenticated={authenticated}
          />
          <NavBarChildren>{children}</NavBarChildren>
        </Responsive>
      </React.Fragment>
    );
  }
}

export default Navbar;
