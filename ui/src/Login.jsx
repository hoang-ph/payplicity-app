import React, { useState } from "react";
import store from './store.js';
import { Form, Button } from "react-bootstrap";
//import "../styles/Login.css";

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        const loginHolder = store.initialData ? store.initialData.about : null;
        //delete store.initialData;
        this.state = { loginHolder };
      }


      async componentDidMount() {
        const { loginHolder } = this.state;
        if (loginHolder == null) {
          const data = 'componentDidMount';
          this.setState({ loginHolder: data.about });
        }
      }
    
      render() {
        const { loginHolder } = this.state;
        return (
          <div className="text-center">
            <h3>Payplicity</h3>
            <h4>
              {loginHolder}
            </h4>
          </div>
        );
      }

}