import React from 'react';
import UserContext from './UserContext.js';
import SyncLoader from "react-spinners/SyncLoader";

export default class LoadingExpense extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const user = this.context;
    const { history } = this.props;
    if (user.signedIn) {
      setTimeout(() => {
        history.push('/expenses');
      }, 500);
    } else {
      setTimeout(() => {
        history.push('/notSignedIn');
      }, 500);
    }
  }

  render() {
    return <SyncLoader size={15} color={"#ff79c6"} loading={true} speedMultiplier={1.5} />
  }
}

LoadingExpense.contextType = UserContext;