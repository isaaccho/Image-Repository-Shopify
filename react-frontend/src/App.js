import "./App.css";
import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      shoes: [],
      name: "",
      price: "",
      nominated: null
    };
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleNominate = this.handleNominate.bind(this);
  }

  onChangeFile(file) {
    this.state.file = file;
  }

  onChangeName(input) {
    this.state.name = input;
  }

  onChangePrice(input) {
    this.state.price = input;
  }

  handleUpload() {
    var data = new FormData();
    data.append("file", this.state.file);
    data.append("name", this.state.name);
    data.append("price", this.state.price);

    fetch("/upload", {
      method: "POST",
      body: data
    }).then(() => {
      this.state = {
        ...this.state,
        file: null,
        shoes: [],
        name: "",
        price: ""
      };
    });
  }

  handleNominate(shoe) {
    console.log(shoe);
    this.setState({
      nominated: shoe
    });
  }

  componentDidMount() {
    fetch("/shoes")
      .then(res => res.json())
      .then(result => {
        this.setState({
          shoes: result.shoes
        });
      });
  }

  render() {
    const funStyle = {
      textAlign: "left"
    };
    return (
      <Container fluid>
            <h1>Popular Shoe Releases of 2020</h1>
        <Row>
          <Col md={6}>
            <Card>
              <Card.Header>Upload Your Own Shoe</Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group>
                    <Form.File
                      type="file"
                      id="pic"
                      label="Image of the Shoe"
                      onChange={e => this.onChangeFile(e.target.files[0])}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Name of the Shoe</Form.Label>
                    <Form.Control
                      placeholder="Name"
                      onChange={e => {
                        this.onChangeName(e.target.value);
                      }}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Market Price</Form.Label>
                    <Form.Control
                      placeholder="Market Price"
                      onChange={e => {
                        this.onChangePrice(e.target.value);
                      }}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    onClick={this.handleUpload}
                  >
                    Upload
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            <p>
              <b>
                <i>
                  Pick your favourite shoe of the year by clicking nominate!
                </i>
              </b>
            </p>
            <h4>
              <b>List of the shoes:</b>
            </h4>
            <Table striped bordered hover>
              {" "}
                    
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Market Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.state.shoes.map((shoe, index) => {
                  return (
                    <tr>
                      <td>{shoe["name"]}</td>
                      <td>
                        <img
                          width="200px"
                          height="200px"
                          src={"../static/".concat(shoe["imgpath"])}
                        />
                      </td>
                      <td>${shoe["marketprice"]}</td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => this.handleNominate(shoe)}
                        >
                          Nominate
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
          <Col md={6}>
            <p style={funStyle}>
              <Card>
                <Card.Header>Fun Fact</Card.Header>
                <Card.Body>
                  <h3>
                    Want to find out how much Michael Jordan game worn shoe
                    shold for?
                  </h3>
                  <Button
                    onClick={() => {
                      const url =
                        "https://www.nytimes.com/2020/05/18/sports/air-jordan-sneakers-auction-record.html";
                      window.open(url, "_blank");
                    }}
                  >
                    YES!
                  </Button>
                </Card.Body>
              </Card>
            </p>
            <br />
            {this.state.nominated !== null && (
              <Card>
                <Card.Header>Your Favourite Shoe of 2020!</Card.Header>
                <Card.Img
                  variant="top"
                  width="180px"
                  height="450px"
                  src={"../static/".concat(this.state.nominated["imgpath"])}
                />
                <Card.Text>{this.state.nominated["name"]}</Card.Text>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
