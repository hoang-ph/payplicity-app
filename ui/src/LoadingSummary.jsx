import React from 'react';
import UserContext from './UserContext.js';

export default class LoadingSummary extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const user = this.context;
    if (user.signedIn) {
      const { history } = this.props;
      history.push('/summary');
    }
  }

  render() {
    return <h1>Please hold on while summary are being loaded</h1>;
  }
}

LoadingSummary.contextType = UserContext;
