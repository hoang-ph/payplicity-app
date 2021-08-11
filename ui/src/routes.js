import ExpenseList from './ExpenseList.jsx';
import ExpenseSummary from './ExpenseSummary.jsx';
import ExpenseEdit from './ExpenseEdit.jsx';
import About from './About.jsx';
import NotFound from './NotFound.jsx';
import Login from './Login.jsx';
import Home from './Home.jsx';

const routes = [
  { path: '/home', component: Home },
  { path: '/expenses/:id?', component: ExpenseList },
  { path: '/edit/:id', component: ExpenseEdit },
  { path: '/summary', component: ExpenseSummary },
  { path: '/about', component: About },
  { path: '/login', component: Login },
  { path: '*', component: NotFound },
];

export default routes;
