import React from 'react';

export default function ExpenseDetail({ expense }) {
  if (expense) {
    return (
      <div>
        <h3>Detail</h3>
        <pre id="expense-detail">{expense.description}</pre>
      </div>
    );
  }
  return null;
}
