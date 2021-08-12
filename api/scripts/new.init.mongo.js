/* global db print */
/* eslint no-restricted-globals: "off" */

/**
 * Run on local host:
 * mongo expensetracker scripts/new.init.mongo.js
 */

db.expenses.remove({});
db.counters.remove({});

const expensesDB = [
  {
    id: 1,
    owner: {
      signedIn: true,
      name: 'Tony',
      email: 'tony@stark.com',
    },
    email: 'tony@strak.com',
    title: 'Movie Night',
    description: 'Fast and Furious 9',
    category: 'Entertainment',
    created: new Date('2021-07-04'),
    amount: 69.95,
    paid: 15.05,
  },
  {
    id: 2,
    owner: {
      signedIn: false,
      name: 'John',
      email: 'johnny@yahoo.com',
    },
    email: 'johnny@yahoo.com',
    title: 'Cheesecake Factory',
    description: 'On a tuesday',
    category: 'Dining',
    created: new Date('2021-08-05'),
    amount: 105.5,
    paid: 52.25,
  },
];

db.expenses.insertMany(expensesDB);
const count = db.expenses.count();
print('Inserted', count, 'expenses');

db.counters.remove({ _id: 'expenses' });
db.counters.insert({ _id: 'expenses', current: count });

db.expenses.createIndex({ id: 1 }, { unique: true });
db.expenses.createIndex({ email: 1 });
db.expenses.createIndex({ category: 1 });
db.expenses.createIndex({ amount: 1 });
db.expenses.createIndex({ created: 1 });
db.expenses.createIndex({ title: 'text', description: 'text' });
