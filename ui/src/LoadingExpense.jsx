import React from 'react';
import UserContext from './UserContext.js';

export default class LoadingExpense extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const user = this.context;
    if (user.signedIn) {
      const { history } = this.props;
      history.push('/expenses');
    }
  }

  render() {
    return <h1>Please hold on while expenses are being loaded</h1>;
  }
}

LoadingExpense.contextType = UserContext;
