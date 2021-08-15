import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import UserContext from './UserContext.js';
import store from './store.js';
import graphQLFetch from './graphQLFetch.js';

export default class Home extends React.Component {
  static async fetchData() {
    const data = await graphQLFetch('query {home}');
    return data;
  }

  constructor(props) {
    super(props);
    const apiHome = store.initialData ? store.initialData.expenseCounts : null;
    delete store.initialData;
    this.state = { apiHome };
  }

  async componentDidMount() {
    const { apiHome } = this.state;
    if (apiHome == null) {
      const data = await Home.fetchData();
      this.setState({ apiHome: data.home });
    }
    const user = this.context;
    if (user.signedIn) {
      const { history } = this.props;
      history.push('/expenses');
    }
  }

  render() {
    const { apiHome } = this.state;
    return (
      <Jumbotron>
        <h1 id="welcome-msg" data-text={apiHome}>{apiHome}</h1>
      </Jumbotron>
    );
  }
}

Home.contextType = UserContext;
