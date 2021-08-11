import React from 'react';
import { Panel, Table } from 'react-bootstrap';

import ExpenseFilter from './ExpenseFilter.jsx';
import withToast from './withToast.jsx';
import graphQLFetch from './graphQLFetch.js';
import store from './store.js';

const categories = ['Housing', 'Transportation', 'Dining', 'Groceries', 'Savings',
  'Entertainment', 'UtilitiesAndPhone', 'Medical', 'Clothing', 'Misc'];

class ExpenseSummary extends React.Component {
  static async fetchData(match, search, showError) {
    const params = new URLSearchParams(search);
    const vars = {};
    if (params.get('category')) vars.category = params.get('category');

    const query = `query expenseList(
      $category: CategoryType
    ) {
      expenseCounts(
        category: $category
      ) {
        owner Housing Transportation Dining Groceries Savings
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
    const { stats } = this.state;
    if (stats == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search) {
      this.loadData();
    }
  }

  async loadData() {
    const { location: { search }, match, showError } = this.props;
    const data = await ExpenseSummary.fetchData(match, search, showError);
    if (data) {
      this.setState({ stats: data.expenseCounts });
    }
  }

  render() {
    const { stats } = this.state;
    if (stats == null) return null;

    const headerColumns = (
      categories.map(category => (
        <th key={category}>{category}</th>
      ))
    );

    const statRows = stats.map(counts => (
      <tr key={counts.owner}>
        <td>{counts.owner}</td>
        {categories.map(category => (
          <td key={category}>{counts[category]}</td>
        ))}
      </tr>
    ));

    return (
      <>
        <Panel>
          <Panel.Heading>
            <Panel.Title toggle>Filter</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            <ExpenseFilter urlBase="/summary" />
          </Panel.Body>
        </Panel>
        <Table bordered condensed hover responsive>
          <thead>
            <tr>
              <th />
              {headerColumns}
            </tr>
          </thead>
          <tbody>
            {statRows}
          </tbody>
        </Table>
      </>
    );
  }
}

const ExpenseSummaryWithToast = withToast(ExpenseSummary);
ExpenseSummaryWithToast.fetchData = ExpenseSummary.fetchData;

export default ExpenseSummaryWithToast;
