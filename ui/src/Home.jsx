import React from 'react';
import { Jumbotron, Carousel } from 'react-bootstrap';
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
      <>
        <Jumbotron>
          <h1 id="welcome-msg" data-text={apiHome}>{apiHome}</h1>
        </Jumbotron>
        <Carousel>
          <Carousel.Item>
            <img className="img-responsive center-block" alt="Dollar sign" src="../styles/icons/bill.png" />
            <h2>Track your spending</h2>
            <h3>Keep track of all your expenses, see what you've been paying</h3>
          </Carousel.Item>
          <Carousel.Item>
            <img className="img-responsive center-block" alt="Dollar sign" src="../styles/icons/category.png" />
            <h2>Organize expenses</h2>
            <h3>Categorize your expense with details: Housing, Transportation, Dining, Groceries, Savings,... and more</h3>
          </Carousel.Item>
          <Carousel.Item>
            <img className="img-responsive center-block" alt="Dollar sign" src="../styles/icons/add.png" />
            <h2>Add expenses easily</h2>
            <h3>Quickly add expenses on the go before you forget</h3>
          </Carousel.Item>
          <Carousel.Item>
            <img className="img-responsive center-block" alt="Dollar sign" src="../styles/icons/summary.png" />
            <h2>Be the boss of your finance</h2>
            <h3>Visualize your money flow with our comprehensive summary</h3>
          </Carousel.Item>
        </Carousel>
      </>
    );
  }
}

Home.contextType = UserContext;
