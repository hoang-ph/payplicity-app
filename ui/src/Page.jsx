import React from 'react';
import {
  Navbar, Nav, NavItem,
  Grid, Col,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Contents from './Contents.jsx';
import ExpenseAddNavItem from './ExpenseAddNavItem.jsx';
import SignInNavItem from './SignInNavItem.jsx';
import Search from './Search.jsx';
import UserContext from './UserContext.js';
import graphQLFetch from './graphQLFetch.js';
import store from './store.js';

function NavBar({ user, onUserChange }) {
  if (!user.signedIn) {
    return (
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>Payplicity</Navbar.Brand>
        </Navbar.Header>
        <Col sm={5}>
          <p> </p>
        </Col>
        <Nav pullRight>
          <SignInNavItem user={user} onUserChange={onUserChange} />
        </Nav>
      </Navbar>
    );
  }
  return (
    <Navbar fluid>
      <Navbar.Header>
        <Navbar.Brand>Payplicity</Navbar.Brand>
      </Navbar.Header>
      <Nav>
        <LinkContainer to="/expenses">
          <NavItem>Expenses</NavItem>
        </LinkContainer>
        <LinkContainer to="/summary">
          <NavItem>Summary</NavItem>
        </LinkContainer>
      </Nav>
      <Col sm={5}>
        <Navbar.Form>
          <Search />
        </Navbar.Form>
      </Col>
      <Nav pullRight>
        <ExpenseAddNavItem user={user} />
        <SignInNavItem user={user} onUserChange={onUserChange} />
      </Nav>
    </Navbar>
  );
}

function Footer() {
  return (
    <div className="page-footer" >
      <hr />
      <p className="text-center">
        Full source code available at this
        {' '}
        <a href="https://github.ccs.neu.edu/NEU-CS5610-SU21/payplicity-app">
          GitHub repository
        </a>
      </p>
      <p className="text-center">
        Copyright ⓒ {new Date().getFullYear()}
      </p>
    </div>
  );
}

export default class Page extends React.Component {
  static async fetchData(cookie) {
    const query = `query { user {
      email signedIn givenName
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
      const data = await Page.fetchData();
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
        <NavBar user={user} onUserChange={this.onUserChange} />
        <Grid fluid>
          <UserContext.Provider value={user}>
            <Contents id="content-wrap" />
          </UserContext.Provider>
        </Grid>
        <Footer />
      </div>
    );
  }
}
