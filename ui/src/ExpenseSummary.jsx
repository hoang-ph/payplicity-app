import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { Chart } from 'react-google-charts';
import withToast from './withToast.jsx';
import graphQLFetch from './graphQLFetch.js';
import store from './store.js';
import UserContext from './UserContext.js';
import NotSignedIn from './NotSignedIn.jsx';

// const categories = ['Housing', 'Transportation', 'Dining', 'Groceries', 'Savings',
//   'Entertainment', 'UtilitiesAndPhone', 'Medical', 'Clothing', 'Misc'];

class ExpenseSummary extends React.Component {
  static async fetchData(match, search, showError, user) {
    // implement params search limit the summary by day, month, year
    // const params = new URLSearchParams(search);
    const vars = {};
    if (user) {
      vars.email = user.email;
    }
    // if (params.get('category')) vars.category = params.get('category');

    const query = `query ($email: String) {
      expenseCounts(email: $email) {
          Housing Transportation Dining Groceries Savings
          Entertainment UtilitiesAndPhone Medical Clothing Misc
      }
    }`;
    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  constructor(props) {
    super(props);
    const stats = store.initialData ? store.initialData.expenseCounts : null;
    delete store.initialData;
    this.state = { stats };
  }

  componentDidMount() {
    const user = this.context;
    const { stats } = this.state;
    if (stats == null) this.loadData(user);
  }

  componentDidUpdate(prevProps) {
    const user = this.context;
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search) {
      this.loadData(user);
    }
  }

  async loadData(user) {
    const { location: { search }, match, showError } = this.props;
    const data = await ExpenseSummary.fetchData(match, search, showError, user);
    if (data) {
      this.setState({ stats: data.expenseCounts });
    }
  }

  render() {
    const { stats } = this.state;
    if (stats == null) return null;
    const data = Object.entries(stats);
    data.unshift(['Category', 'Amount spent']);
    const { signedIn } = this.context;
    if (!signedIn) {
      return <NotSignedIn />;
    }
    return (
      <>
        <Grid>
          <Row>
            <Col xs={12}>
              <p><b>Percentage based on total</b></p>
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={data}
                rootProps={{ 'data-testid': '1' }}
                options={{
                  backgroundColor: 'transparent',
                  is3D: true,
                }}
              />
            </Col>
            <Col xs={12}>
              <Chart
                width="100%"
                height="300px"
                chartType="BarChart"
                loader={<div>Loading Chart</div>}
                data={data}
                options={{
                  title: 'Amount Spent by Category',
                  chartArea: { width: '50%' },
                  hAxis: {
                    title: 'Dollar',
                    minValue: 0,
                  },
                  vAxis: {
                    title: 'Category',
                  },
                  backgroundColor: 'transparent',
                  colors: ['#44475a'],
                  animation: {
                    startup: true,
                    easing: 'inAndOut',
                    duration: 2000,
                  },
                }}
                rootProps={{ 'data-testid': '1' }}
                controls={[
                  {
                    controlType: 'NumberRangeFilter',
                    controlID: 'amount-filter',
                    options: {
                      filterColumnIndex: 1,
                      ui: {
                        labelStacking: 'vertical',
                        label: 'Amount Range:',
                        allowTyping: false,
                        allowMultiple: false,
                      },
                    },
                  },
                ]}
              />
            </Col>
          </Row>
        </Grid>
      </>
    );
  }
}
ExpenseSummary.contextType = UserContext;

const ExpenseSummaryWithToast = withToast(ExpenseSummary);
ExpenseSummaryWithToast.fetchData = ExpenseSummary.fetchData;

export default ExpenseSummaryWithToast;
