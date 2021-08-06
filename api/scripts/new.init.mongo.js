/* global db print */
/* eslint no-restricted-globals: "off" */

/**
 * Run on local host:
 * mongo expensetracker scripts/new.init.mongo.js
 */

db.expenses.remove({});
db.users.remove({});

const expensesDB = [
  {
    id: 1,
    owner: 'Tony',
    title: 'Movie Night',
    description: '',
    category: 'Entertainment',
    created: new Date('2021-07-04'),
    amount: 69.95,
    paid: 15.05,
    imageSrc: 'https://www.google.com/search?q=movie+receipt&tbm=isch&ved=2ahUKEwjf1c2r8pzyAhW7LDQIHSHpAv4Q2-cCegQIABAA&oq=movie+re&gs_lcp=CgNpbWcQARgAMgQIABBDMggIABCABBCxAzIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEOgQIIxAnOgsIABCABBCxAxCDAToHCAAQsQMQQ1DOsAFY5rYBYMfBAWgAcAB4AIABSogBjASSAQE4mAEAoAEBqgELZ3dzLXdpei1pbWfAAQE&sclient=img&ei=lm0NYd-yNbvZ0PEPodKL8A8&bih=789&biw=1440#imgrc=8sNzkh7W38NBRM',
    group: {
      groupName: 'group1',
      groupMember: [
        {
          memberName: 'person1',
          id: 1234,
        },
        {
          memberName: 'person2',
          id: 4321,
        }
      ]
    },
  },
  {
    id: 2,
    owner: 'John',
    title: 'Cheesecake Factory',
    description: 'On a tuesday',
    category: 'Dinning',
    created: new Date('2021-08-05'),
    amount: 105.5,
    paid: 52.25,
    imageSrc: 'https://www.google.com/shttps://www.google.com/search?q=restaurant+receipt&tbm=isch&ved=2ahUKEwiv1tjf9JzyAhUQjp4KHZRBBfEQ2-cCegQIABAA&oq=restaurant+rec&gs_lcp=CgNpbWcQARgAMgUIABCABDIECAAQQzIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBAgAEEMyBQgAEIAEMgUIABCABDIFCAAQgAQ6BAgjECc6CAgAEIAEELEDOggIABCxAxCDAToLCAAQgAQQsQMQgwE6BwgAELEDEENQixBY_zZglz5oA3AAeACAAUaIAbsHkgECMTWYAQCgAQGqAQtnd3Mtd2l6LWltZ8ABAQ&sclient=img&ei=HHANYa_YO5Cc-gSUg5WIDw&bih=789&biw=1440#imgrc=lwxf-xfKw80d8Mearch?q=movie+receipt&tbm=isch&ved=2ahUKEwjf1c2r8pzyAhW7LDQIHSHpAv4Q2-cCegQIABAA&oq=movie+re&gs_lcp=CgNpbWcQARgAMgQIABBDMggIABCABBCxAzIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEOgQIIxAnOgsIABCABBCxAxCDAToHCAAQsQMQQ1DOsAFY5rYBYMfBAWgAcAB4AIABSogBjASSAQE4mAEAoAEBqgELZ3dzLXdpei1pbWfAAQE&sclient=img&ei=lm0NYd-yNbvZ0PEPodKL8A8&bih=789&biw=1440#imgrc=8sNzkh7W38NBRM',
    group: {
      groupName: 'group2',
      groupMember: [
        {
          memberName: 'person3',
          id: 3333,
        }
      ]
    },
  },
];

db.expenses.insertMany(expensesDB);
const count = db.expenses.count();
print('Inserted', count, 'expenses');

db.counters.remove({ _id: 'expenses' });
db.counters.insert({ _id: 'expenses', current: count });

db.expenses.createIndex({ id: 1 }, { unique: true });
db.expenses.createIndex({ group: 1}, { unique: true });
db.expenses.createIndex({ category: 1 });
db.expenses.createIndex({ owner: 1 });
db.expenses.createIndex({ created: 1 });
db.expenses.createIndex({ title: 'text', description: 'text' });
