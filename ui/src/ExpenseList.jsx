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
import UserContext from './UserContext.js';
import NotSignedIn from './NotSignedIn.jsx';

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
  static async fetchData(match, search, showError, user) {
    const params = new URLSearchParams(search);
    const vars = { hasSelection: false, selectedId: 0 };
    if (params.get('category')) vars.category = params.get('category');
    const { params: { id } } = match;
    const idInt = parseInt(id, 10);
    if (!Number.isNaN(idInt)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
    }

    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    vars.page = page;
    if (user) {
      vars.email = user.email;
    }

    const query = `query ($email: String
      $category: CategoryType
      $hasSelection: Boolean!
      $selectedId: Int!
      $page: Int) {
      expenseList(
        email: $email
        category: $category
        page: $page
      ) {
        expenses {
          id email description category amount created
        }
        pages
      }
      expense(id: $selectedId, email: $email) @include (if : $hasSelection) {
        id description category amount created
      }
    }`;
    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  constructor(props) {
    super(props);
    const initialData = store.initialData || { expenseList: {} };
    const {
      expenseList: { expenses, pages }, expense: selectedExpense,
    } = initialData;
    delete store.initialData;
    this.state = {
      expenses,
      selectedExpense,
      pages,
      loading: false,
    };
    this.removeExpense = this.removeExpense.bind(this);
  }

  componentDidMount() {
    const user = this.context;
    const { expenses } = this.state;
    if (expenses == null) this.loadData(user);
  }

  componentDidUpdate(prevProps) {
    const user = this.context;
    const {
      location: { search: prevSearch },
      match: { params: { id: prevId } },
    } = prevProps;
    const { location: { search }, match: { params: { id } } } = this.props;
    if (prevSearch !== search || prevId !== id) {
      this.loadData(user);
    }
  }

  async loadData(user) {
    const { location: { search }, match, showError } = this.props;
    const data = await ExpenseList.fetchData(match, search, showError, user);
    if (data) {
      this.setState({
        expenses: data.expenseList.expenses,
        selectedExpense: data.expense,
        pages: data.expenseList.pages,
        loading: true,
      });
    }
  }

  async removeExpense(index) {
    const query = `mutation expenseRemove($id: Int!) {
      expenseRemove(id: $id)
    }`;
    const { expenses } = this.state;
    const { location: { pathname, search }, history } = this.props;
    const { showSuccess, showError } = this.props;
    const { id } = expenses[index];
    const data = await graphQLFetch(query, { id }, showError);
    if (data && data.expenseRemove) {
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
          {`Removed expense ${id} successfully.`}
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
    const query = `mutation expenseRestore($id: Int!) {
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

    const { signedIn } = this.context;
    if (!signedIn) return <NotSignedIn />;

    const { loading } = this.state;

    return (<>
      {!loading ? <h1>Still loading - putting a spinner here maybe</h1> :
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
          removeExpense={this.removeExpense}
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
      </React.Fragment>}
   </> );
  }
}

ExpenseList.contextType = UserContext;

const ExpenseListWithToast = withToast(ExpenseList);
ExpenseListWithToast.fetchData = ExpenseList.fetchData;

export default ExpenseListWithToast;
