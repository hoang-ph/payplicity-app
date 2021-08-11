import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import graphQLFetch from './graphQLFetch.js';
import SignInNavItem from './SignInNavItem.jsx';
import store from './store.js';

function WelcomeSection({ user, onUserChange }) {
  return (
    <div>
      <Jumbotron>
        <h1>Welcome to Payplicity</h1>
        <p>
          Trouble keeping track of your spending? Let us help you to manage your
          money
        </p>
        <LinkContainer to="/login">
          <p>Login</p>
        </LinkContainer>
        <p>
          Register - need to make a /register
        </p>
        <LinkContainer to="/issues">
          <p>Expense List - for testing</p>
        </LinkContainer>
        <p>
          <SignInNavItem user={user} onUserChange={onUserChange} />
        </p>
      </Jumbotron>
    </div>
  );
}

export default class LandingPage extends React.Component {
  static async fetchData(cookie) {
    const query = `query { user {
      signedIn givenName
    }}`;
    const data = await graphQLFetch(query, null, null, cookie);
    return data;
  }

  constructor(props) {
    super(props);
    const user = store.userData ? store.userData.user : null;
    delete store.userData;
    this.state = { user };

    this.onUserChange = this.onUserChange.bind(this);
  }

  async componentDidMount() {
    const { user } = this.state;
    if (user == null) {
      const data = await LandingPage.fetchData();
      this.setState({ user: data.user });
    }
  }

  onUserChange(user) {
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    if (user == null) return null;

    return (
      <div>
        <WelcomeSection user={user} onUserChange={this.onUserChange} />
      </div>
    );
  }
}