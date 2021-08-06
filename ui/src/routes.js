import IssueList from './IssueList.jsx';
// import IssueReport from './IssueReport.jsx';
import ExpenseSummary from './ExpenseSummary.jsx';
import IssueEdit from './IssueEdit.jsx';
import About from './About.jsx';
import NotFound from './NotFound.jsx';

const routes = [
  { path: '/issues/:id?', component: IssueList },
  { path: '/edit/:id', component: IssueEdit },
  { path: '/summary', component: ExpenseSummary },
  { path: '/about', component: About },
  { path: '*', component: NotFound },
];

export default routes;
