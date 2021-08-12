/* global db print */
/* eslint no-restricted-globals: "off" */

// db.expenses.dropIndex('group_1'); // Bug fixed for now

const emails = [ 'ravan@a', 'eddie@1', 'pieta@1', 'haiphong1712@gmail.com', 'nguyen.an.1196@gmail.com'];

const categories = [
  'Housing',
  'Transportation',
  'Dining',
  'Groceries',
  'Savings',
  'Entertainment',
  'UtilitiesAndPhone',
  'Medical',
  'Clothing',
  'Misc',
];

const initialCount = db.expenses.count();

for (let i = 0; i < 100; i += 1) {
  const randomCreatedDate = new Date() - Math.floor(Math.random() * 60) * 1000 * 60 * 60 * 24;
  const created = new Date(randomCreatedDate);

  const email = emails[Math.floor(Math.random() * 5)];
  const category = categories[Math.floor(Math.random() * 10)];
  const description = `Lorem ipsum dolor sit amet, ${i}`;
  const amount = Math.ceil(Math.random() * 20);
  const paid = Math.ceil(Math.random() * 5);
  const id = initialCount + i + 1;

  const expense = {
    id, email, description, category, created, amount, paid
  };
  db.expenses.insertOne(expense);
}

const count = db.expenses.count();
db.counters.update({ _id: 'expenses' }, { $set: { current: count } });

print('New expense count:', count);
