import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import UserContext from './UserContext.js';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showing: true };
  }

  componentDidMount() {
    const user = this.context;
    if (user.signedIn) {
      this.setState({ showing: false });
    }
  }

  render() {
    const { showing } = this.state;
    if (showing) {
      return (
        <Jumbotron>
          <h1>Welcome to Payplicity</h1>
        </Jumbotron>
      );
    }
    return (
      <Redirect to="/expenses" />
    );
  }
}

Home.contextType = UserContext;
