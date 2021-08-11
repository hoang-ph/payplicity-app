/* global db print */
/* eslint no-restricted-globals: "off" */

/**
 * Run on local host:
 * mongo expensetracker scripts/new.init.mongo.js
 */

db.expenses.remove({});
db.counters.remove({})
db.users.remove({});

const expensesDB = [
  {
    id: 1,
    email: 'tony@strak.com',
    description: 'Fast and Furious 9',
    category: 'Entertainment',
    created: new Date('2021-07-04'),
    amount: 69.95,
  },
  {
    id: 2,
    email: 'johnny@yahoo.com',
    description: 'On a tuesday',
    category: 'Dinning',
    created: new Date('2021-08-05'),
    amount: 105.5,
  },
  {
    id: 3,
    email: 'johnny@yahoo.com',
    description: 'On thursday',
    category: 'Misc',
    created: new Date('2021-08-05'),
    amount: 105.5,
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
db.expenses.createIndex({ owner: 1 });
db.expenses.createIndex({ created: 1 });
db.expenses.createIndex({ title: 'text', description: 'text' });
