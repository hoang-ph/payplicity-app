const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./new_db.js');
const { mustBeSignedIn } = require('./auth.js');

async function get(_, { id }) {
  const db = getDb();
  const expense = await db.collection('expenses').findOne({ id });
  return expense;
}

const PAGE_SIZE = 10;

async function list(_, {
  category, debtMin, debtMax, search, page,
}) {
  const db = getDb();
  const filter = {};

  if (category) filter.category = category;

  if (debtMin !== undefined || debtMax !== undefined) {
    filter.amount = {};
    if (debtMin !== undefined) filter.amount.$gte = debtMin;
    if (debtMax !== undefined) filter.amount.$lte = debtMax;
  }

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
  if (expense.title.length === null) {
    errors.push('Title filed must be entered.');
  }
  if (expense.paid > expense.amount) {
    errors.push('Paid amount cannot be larger than owned amount.');
  }
  if (expense.amount <= 0) {
    errors.push('Owned amount has to be greater than 0.');
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
  newExpense.id = await getNextSequence('expense');

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

async function counts(_, { category, debtMin, debtMax }) {
  const db = getDb();
  const filter = {};

  if (category) filter.category = category;

  if (debtMin !== undefined || debtMax !== undefined) {
    filter.amount = {};
    if (debtMin !== undefined) filter.amount.$gte = debtMin;
    if (debtMax !== undefined) filter.amount.$lte = debtMax;
  }

  const results = await db.collection('expenses').aggregate([
    { $match: filter },
    {
      $group: {
        _id: { owner: '$owner', category: '$category' },
        count: { $sum: 1 },
      },
    },
  ]).toArray();

  const stats = {};
  results.forEach((result) => {
    // eslint-disable-next-line no-underscore-dangle
    const { owner, status: statusKey } = result._id;
    if (!stats[owner]) stats[owner] = { owner };
    stats[owner][statusKey] = result.count;
  });
  return Object.values(stats);
}

module.exports = {
  list,
  add: mustBeSignedIn(add),
  get,
  update: mustBeSignedIn(update),
  counts,
};