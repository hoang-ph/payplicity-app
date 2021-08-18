import React from 'react';

export default function ExpenseDetail({ expense }) {
  if (expense) {
    return (
      <div>
        <h3>Detail</h3>
        <pre id="expense-detail">On {expense.created.toDateString()}, you spent {expense.amount} for {expense.description}</pre>
      </div>
    );
  }
  return null;
}
