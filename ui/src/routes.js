import IssueList from './IssueList.jsx';
// import IssueReport from './IssueReport.jsx';
import ExpenseSummary from './ExpenseSummary.jsx';
import IssueEdit from './IssueEdit.jsx';
import About from './About.jsx';
import NotFound from './NotFound.jsx';
import Login from './Login.jsx';


const routes = [
  { path: '/issues/:id?', component: IssueList },
  { path: '/edit/:id', component: IssueEdit },
  { path: '/summary', component: ExpenseSummary },
  { path: '/about', component: About },
  //{path: '/login', component: Login},
  { path: '*', component: NotFound },
];

export default routes;
