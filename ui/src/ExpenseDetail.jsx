import React from 'react';

export default function ExpenseDetail({ expense }) {
  if (expense) {
    return (
      <div>
        <h3>Detail</h3>
        <pre>{expense.description}</pre>
      </div>
    );
  }
  return null;
}
