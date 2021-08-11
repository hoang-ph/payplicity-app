import React, { useState } from "react";
import store from './store.js';
import {
  Form, FormGroup, Col,
  FormControl, ControlLabel, Button
} from "react-bootstrap";
import { userInfo } from "os";
//import "../styles/Login.css";

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    const loginHolder = store.initialData ? store.initialData.about : null;
    //delete store.initialData;
    this.state = { loginHolder };
    this.state = {
      "sign_email": "",
      "sign_password": "",
      "reg_email": "",
      "reg_password": "",
      "name": "",
      "givenName": "",
    }
  }


  async componentDidMount() {
    const { loginHolder } = this.state;
    if (loginHolder == null) {
      const data = 'componentDidMount';
      this.setState({ loginHolder: data.about });
    }
  }

  handleChange(e, name) {
    this.setState({[name]: e.target.value})
  }

  signin(){
    userInfo = { "email": this.state.sign_email,  "password": this.state.sign_password }
  }

  register() {
    userInfo = { "email": this.state.sign_email,  
                 "password": this.state.sign_password,
                 "name": this.state.name,
                 "givenName": this.state.givenName}
    console.log(userInfo)
   
  }

  render() {
    const { loginHolder } = this.state;
    return (
      <div>
        <div className="col-md-6 col-sm-12">
          <h3 className="text-center"
            style={{ "margin-bottom": "30px" }}>Sign Up</h3>
          <Form horizontal>
            <FormGroup controlId="formHorizontalEmail">
              <Col componentClass={ControlLabel} sm={2}>
                Email:
              </Col>
              <Col sm={10}>
                <FormControl type="email"
                  onChange={e => this.handleChange(e, "sign_email")}
                  placeholder="Email" />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalPassword">
              <Col componentClass={ControlLabel} sm={2}>
                Password:
              </Col>
              <Col sm={10}>
                <FormControl type="password"
                  onChange={e => this.handleChange(e, "sign_password")}
                  placeholder="Password" />
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={2} sm={10}>
                <Button type="submit"
                        onClick={this.signin}>Sign in</Button>
              </Col>
            </FormGroup>
          </Form>
        </div>
        <div className="col-md-6 col-sm-12">
          <h3 className="text-center"
            style={{ "margin-bottom": "30px" }}>Register</h3>
          <Form horizontal>
            <FormGroup controlId="formHorizontalName">
              <Col componentClass={ControlLabel} sm={2}>
                Name:
              </Col>
              <Col sm={10}>
                <FormControl type="text"
                  onChange={e => this.handleChange(e, "name")}
                  placeholder="Name" />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontal">
              <Col componentClass={ControlLabel} sm={2}>
                Given Name:
              </Col>
              <Col sm={10}>
                <FormControl type="text"
                  onChange={e => this.handleChange(e, "givenName")}
                  placeholder="Given Name" />
              </Col>
            </FormGroup>


            <FormGroup controlId="formHorizontalEmail">
              <Col componentClass={ControlLabel} sm={2}>
                Email:
              </Col>
              <Col sm={10}>
                <FormControl type="email"
                  onChange={e => this.handleChange(e, "reg_email")}
                  placeholder="Email" />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalPassword">
              <Col componentClass={ControlLabel} sm={2}>
                Password:
              </Col>
              <Col sm={10}>
                <FormControl type="password"
                  onChange={e => this.handleChange(e, "reg_password")}
                  placeholder="Password" />
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={2} sm={10}>
                <Button type="submit"
                        onClick={this.register}>Register</Button>
              </Col>
            </FormGroup>
          </Form>
        </div>
      </div>
    );
  }

}