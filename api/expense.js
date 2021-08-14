const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./new_db.js');
// const { mustBeSignedIn } = require('./auth.js');

async function get(_, { id, email }) {
  const db = getDb();
  const expense = await db.collection('expenses').findOne({ id, email });
  return expense;
}

const PAGE_SIZE = 10;

async function list(_, {
  email, category, search, page,
}) {
  const db = getDb();
  const filter = {};

  if (email) filter.email = email;

  if (category) filter.category = category;

  if (search) filter.$text = { $search: search };

  const cursor = db.collection('expenses').find(filter)
    .sort({ id: 1 })
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE);

  const totalCount = await cursor.count(false);
  const expenses = cursor.toArray();
  const pages = Math.ceil(totalCount / PAGE_SIZE);
  return { expenses, pages };
}

function validate(expense) {
  const errors = [];
  if (expense.description.length === null) {
    errors.push('Description filed must be entered.');
  }
  if (expense.amount <= 0) {
    errors.push('Amount has to be greater than 0.');
  }
  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
}

async function add(_, { expense }) {
  const db = getDb();
  validate(expense);

  const newExpense = Object.assign({}, expense);
  newExpense.created = new Date();
  newExpense.id = await getNextSequence('expenses');

  const result = await db.collection('expenses').insertOne(newExpense);
  const savedExpense = await db.collection('expenses')
    .findOne({ _id: result.insertedId });
  return savedExpense;
}

async function update(_, { id, changes }) {
  const db = getDb();
  if (changes.title || changes.amount || changes.paid) {
    const expense = await db.collection('expenses').findOne({ id });
    Object.assign(expense, changes);
    validate(expense);
  }
  await db.collection('expenses').updateOne({ id }, { $set: changes });
  const savedExpense = await db.collection('expenses').findOne({ id });
  return savedExpense;
}

async function remove(_, { id }) {
  const db = getDb();
  const expense = await db.collection('expenses').findOne({ id });
  if (!expense) return false;
  expense.deleted = new Date();

  let result = await db.collection('deleted_expenses').insertOne(expense);
  if (result.insertedId) {
    result = await db.collection('expenses').removeOne({ id });
    return result.deletedCount === 1;
  }
  return false;
}

async function restore(_, { id }) {
  const db = getDb();
  const expense = await db.collection('deleted_expenses').findOne({ id });
  if (!expense) return false;
  expense.deleted = new Date();

  let result = await db.collection('expenses').insertOne(expense);
  if (result.insertedId) {
    result = await db.collection('deleted_issues').removeOne({ id });
    return result.deletedCount === 1;
  }
  return false;
}

async function counts(_, { email }) {
  const db = getDb();
  const filter = {};
  if (email) filter.email = email;

  const results = await db.collection('expenses').aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
      },
    },
  ]).toArray();
  console.log(results);

  const stats = {};
  results.forEach((result) => {
    // eslint-disable-next-line no-underscore-dangle
    const category = result._id;
    stats[category] = result.total;
  });
  return stats;
}

module.exports = {
  list,
  add,
  get, // mustBeSignedIn(get)
  update, // mustBeSignedIn(update),
  remove,
  restore,
  counts,
};
