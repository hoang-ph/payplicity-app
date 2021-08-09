import React from 'react';
import URLSearchParams from 'url-search-params';
import { Panel, Pagination, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import ExpenseFilter from './ExpenseFilter.jsx';
import ExpenseTable from './ExpenseTable.jsx';
import ExpenseDetail from './ExpenseDetail.jsx';
import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';
import store from './store.js';

const SECTION_SIZE = 5;

function PageLink({
  params, page, activePage, children,
}) {
  params.set('page', page);
  if (page === 0) return React.cloneElement(children, { disabled: true });
  return (
    <LinkContainer
      isActive={() => page === activePage}
      to={{ search: `?${params.toString()}` }}
    >
      {children}
    </LinkContainer>
  );
}

class ExpenseList extends React.Component {
  static async fetchData(match, search, showError) {
    const params = new URLSearchParams(search);
    const vars = { hasSelection: false, selectedId: 0 };
    if (params.get('status')) vars.status = params.get('status');

    const amountMin = parseInt(params.get('amountMin'), 10);
    if (!Number.isNaN(amountMin)) vars.amountMin = amountMin;
    const amountMax = parseInt(params.get('amountMax'), 10);
    if (!Number.isNaN(amountMax)) vars.amountMax = amountMax;

    const { params: { id } } = match;
    const idInt = parseInt(id, 10);
    if (!Number.isNaN(idInt)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
    }

    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    vars.page = page;

    const query = `query expenseList(
      $category: CategoryType
      $amountMin: Int
      $amountMax: Int
      $hasSelection: Boolean!
      $selectedId: Int!
      $page: Int
    ) {
      ExpenseList(
        status: $status
        amountMin: $amountMin
        amountMax: $amountMax
        page: $page
      ) {
        expenses {
          description category amount
          created imageSrc
        }
        pages
      }
      expense(id: $selectedId) @include (if : $hasSelection) {
        id imageSrc
      }
    }`;

    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  constructor() {
    super();
    const initialData = store.initialData || { ExpenseList: {} };
    const {
      ExpenseList: { expenses, pages }, expense: selectedExpense,
    } = initialData;
    delete store.initialData;
    this.state = {
      expenses,
      selectedExpense,
      pages,
    };
    this.closeExpense = this.closeExpense.bind(this);
    this.deleteExpense = this.deleteExpense.bind(this);
  }

  componentDidMount() {
    const { expenses } = this.state;
    if (expenses == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
      match: { params: { id: prevId } },
    } = prevProps;
    const { location: { search }, match: { params: { id } } } = this.props;
    if (prevSearch !== search || prevId !== id) {
      this.loadData();
    }
  }

  async loadData() {
    const { location: { search }, match, showError } = this.props;
    const data = await ExpenseList.fetchData(match, search, showError);
    if (data) {
      this.setState({
        expenses: data.ExpenseList.expenses,
        selectedExpense: data.expense,
        pages: data.ExpenseList.pages,
      });
    }
  }

  async deleteExpense(index) {
    const query = `mutation expenseDelete($id: Int!) {
      expenseDelete(id: $id)
    }`;
    const { expenses } = this.state;
    const { location: { pathname, search }, history } = this.props;
    const { showSuccess, showError } = this.props;
    const { id } = expenses[index];
    const data = await graphQLFetch(query, { id }, showError);
    if (data && data.expenseDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.expenses];
        if (pathname === `/expenses/${id}`) {
          history.push({ pathname: '/expenses', search });
        }
        newList.splice(index, 1);
        return { expenses: newList };
      });
      const undoMessage = (
        <span>
          {`Deleted expense ${id} successfully.`}
          <Button bsStyle="link" onClick={() => this.restoreExpense(id)}>
            UNDO
          </Button>
        </span>
      );
      showSuccess(undoMessage);
    } else {
      this.loadData();
    }
  }

  async restoreExpense(id) {
    const query = `mutation restoreExpense($id: Int!) {
      expenseRestore(id: $id)
    }`;
    const { showSuccess, showError } = this.props;
    const data = await graphQLFetch(query, { id }, showError);
    if (data) {
      showSuccess(`Expense ${id} restored successfully.`);
      this.loadData();
    }
  }

  render() {
    const { expenses } = this.state;
    if (expenses == null) return null;

    const { selectedExpense, pages } = this.state;
    const { location: { search } } = this.props;

    const params = new URLSearchParams(search);
    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    const startPage = Math.floor((page - 1) / SECTION_SIZE) * SECTION_SIZE + 1;
    const endPage = startPage + SECTION_SIZE - 1;
    const prevSection = startPage === 1 ? 0 : startPage - SECTION_SIZE;
    const nextSection = endPage >= pages ? 0 : startPage + SECTION_SIZE;

    const items = [];
    for (let i = startPage; i <= Math.min(endPage, pages); i += 1) {
      params.set('page', i);
      items.push((
        <PageLink key={i} params={params} activePage={page} page={i}>
          <Pagination.Item>{i}</Pagination.Item>
        </PageLink>
      ));
    }

    return (
      <React.Fragment>
        <Panel>
          <Panel.Heading>
            <Panel.Title toggle>Filter</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            <ExpenseFilter urlBase="/expenses" />
          </Panel.Body>
        </Panel>
        <ExpenseTable
          expenses={expenses}
          deleteExpense={this.deleteExpense}
        />
        <ExpenseDetail expense={selectedExpense} />
        <Pagination>
          <PageLink params={params} page={prevSection}>
            <Pagination.Item>{'<'}</Pagination.Item>
          </PageLink>
          {items}
          <PageLink params={params} page={nextSection}>
            <Pagination.Item>{'>'}</Pagination.Item>
          </PageLink>
        </Pagination>
      </React.Fragment>
    );
  }
}

const ExpenseListWithToast = withToast(ExpenseList);
ExpenseListWithToast.fetchData = ExpenseList.fetchData;

export default ExpenseListWithToast;
