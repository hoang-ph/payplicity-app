import React from 'react';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Button, Glyphicon, Tooltip, OverlayTrigger, Table,
} from 'react-bootstrap';

import UserContext from './UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class ExpenseRowPlain extends React.Component {
  render() {
    const {
      expense, location: { search }, deleteExpense, index,
    } = this.props;
    const user = this.context;
    const disabled = !user.signedIn;

    const selectLocation = { pathname: `/expenses/${expense.id}`, search };
    const editTooltip = (
      <Tooltip id="edit-tooltip" placement="top">Edit Expense</Tooltip>
    );
    const deleteTooltip = (
      <Tooltip id="delete-tooltip" placement="top">Delete Expense</Tooltip>
    );

    function onDelete(e) {
      e.preventDefault();
      deleteExpense(index);
    }

    const tableRow = (
      <tr>
        <td>{expense.description}</td>
        <td>{expense.category}</td>
        <td>{expense.amount}</td>
        <td>{expense.created.toDateString()}</td>
        <td>
          <LinkContainer to={`/edit/${expense.id}`}>
            <OverlayTrigger delayShow={1000} overlay={editTooltip}>
              <Button bsSize="xsmall">
                <Glyphicon glyph="edit" />
              </Button>
            </OverlayTrigger>
          </LinkContainer>
          {' '}
          <OverlayTrigger delayShow={1000} overlay={deleteTooltip}>
            <Button disabled={disabled} bsSize="xsmall" onClick={onDelete}>
              <Glyphicon glyph="trash" />
            </Button>
          </OverlayTrigger>
        </td>
      </tr>
    );

    return (
      <LinkContainer to={selectLocation}>
        {tableRow}
      </LinkContainer>
    );
  }
}

ExpenseRowPlain.contextType = UserContext;
const ExpenseRow = withRouter(ExpenseRowPlain);
delete ExpenseRow.contextType;

export default function ExpenseTable({ expenses, deleteExpense }) {
  const expenseRows = expenses.map((expense, index) => (
    <ExpenseRow
      key={expense.id}
      expense={expense}
      deleteExpense={deleteExpense}
      index={index}
    />
  ));

  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          <th>Description</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {expenseRows}
      </tbody>
    </Table>
  );
}
