import React from "react";

// const src = "https://images.unsplash.com/photo-1444065381814-865dc9da92c0";

class ImageZoom extends React.Component {
  state = {
    backgroundImage: ``,
    backgroundPosition: "0% 0%",
    cursor: "zoom-in",
  };
  componentDidMount() {
    this.setState({ backgroundImage: `url(${this.props.image})` });
  }

  handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    this.setState({ backgroundPosition: `${x}% ${y}%` });
  };

  render = () => {
    return (
      <figure
        onMouseMove={this.handleMouseMove}
        style={this.state}
        className="borderSolid"
      >
        <img src={this.props.image} alt="Zoomed" />
      </figure>
    );
  };
}

export default ImageZoom;
