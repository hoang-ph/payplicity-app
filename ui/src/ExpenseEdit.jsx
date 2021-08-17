import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Col, Panel, Form, FormGroup, FormControl, ControlLabel,
  ButtonToolbar, Button, Alert,
} from 'react-bootstrap';

import graphQLFetch from './graphQLFetch.js';
import DateInput from './DateInput.jsx';
import TextInput from './TextInput.jsx';
import withToast from './withToast.jsx';
import store from './store.js';
import UserContext from './UserContext.js';
import NotSignedIn from './NotSignedIn.jsx';

class ExpenseEdit extends React.Component {
  static async fetchData(match, search, showError, user) {
    const query = `query expense($id: Int!, $email: String) {
      expense(id: $id, email: $email) {
        id description category created amount
        email
      }
    }`;
    const { params: { id } } = match;
    const vars = { id };
    if (user) {
      vars.email = user.email;
    };
    const result = await graphQLFetch(query, vars, showError);
    return result;
  }

  constructor() {
    super();
    const expense = store.initialData ? store.initialData.expense : null;
    delete store.initialData;
    this.state = {
      expense,
      invalidFields: {},
      showingValidation: false,
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.dismissValidation = this.dismissValidation.bind(this);
    this.showValidation = this.showValidation.bind(this);
  }

  componentDidMount() {
    const user = this.context;
    const { expense } = this.state;
    if (expense == null) this.loadData(user);
  }

  componentDidUpdate(prevProps) {
    const user = this.context;
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData(user);
    }
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      expense: { ...prevState.expense, [name]: value },
    }));
  }

  onValidityChange(event, valid) {
    const { name } = event.target;
    this.setState((prevState) => {
      const invalidFields = { ...prevState.invalidFields, [name]: !valid };
      if (valid) delete invalidFields[name];
      return { invalidFields };
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.showValidation();
    const { expense, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;

    const query = `mutation expenseUpdate(
      $id: Int!
      $changes: ExpenseUpdateInputs!
    ) {
      expenseUpdate(
        id: $id
        changes: $changes
      ) {
        id description category created amount email
      }
    }`;

    const { id, created, ...changes } = expense;
    const { showSuccess, showError } = this.props;
    const data = await graphQLFetch(query, { changes, id: parseInt(id, 10) }, showError);
    if (data) {
      this.setState({ expense: data.expenseUpdate });
      showSuccess('Updated expense successfully');
      setTimeout(() => {
        const { history } = this.props;
        history.push('/expenses');
      }, 1000);
    }
  }

  async loadData(user) {
    const { match, showError } = this.props;
    const data = await ExpenseEdit.fetchData(match, null, showError, user);
    this.setState({ expense: data ? data.expense : {}, invalidFields: {} });
  }

  showValidation() {
    this.setState({ showingValidation: true });
  }

  dismissValidation() {
    this.setState({ showingValidation: false });
  }

  render() {
    const { expense } = this.state;
    if (expense == null) return null;

    const { expense: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`expense with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }

    const { invalidFields, showingValidation } = this.state;
    let validationMessage;
    if (Object.keys(invalidFields).length !== 0 && showingValidation) {
      validationMessage = (
        <Alert bsStyle="danger" onDismiss={this.dismissValidation}>
          Please correct invalid fields before submitting.
        </Alert>
      );
    }

    const { expense: { description, category } } = this.state;
    const { expense: { created, amount } } = this.state;

    return (
      <>
      {!this.context.signedIn ? <NotSignedIn /> :
      <Panel>
        <Panel.Heading>
          <Panel.Title>{`Editing expense: ${id}`}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Created</Col>
              <Col sm={9}>
                <FormControl.Static>
                  {created.toDateString()}
                </FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Category</Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  name="category"
                  value={category}
                  onChange={this.onChange}
                >
                  <option value="Misc">😊 Misc</option>
                  <option value="Housing">🏠 Housing</option>
                  <option value="Transportation">🚌 Transportation</option>
                  <option value="Dining">🍽️ Dining</option>
                  <option value="Savings">💸 Savings</option>
                  <option value="Groceries">🛍️ Groceries</option>
                  <option value="Entertainment">🎭 Entertainment</option>
                  <option value="UtilitiesAndPhone">📱 Utility & Phone</option>
                  <option value="Medical">😷 Medical</option>
                  <option value="Clothing">👔👚 Clothing</option>
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Amount</Col>
              <Col sm={9}>
                <FormControl
                  name="amount"
                  value={amount}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup validationState={null
              // invalidFields.due ? 'error' : null
            }
            >
              <Col componentClass={ControlLabel} sm={3}>Created</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={DateInput}
                  onValidityChange={this.onValidityChange}
                  name="created"
                  value={created}
                  onChange={this.onChange}
                  key={id}
                />
                <FormControl.Feedback />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Description</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  tag="textarea"
                  rows={4}
                  cols={50}
                  name="description"
                  value={description}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={6}>
                <ButtonToolbar>
                  <Button
                    bsStyle="primary"
                    type="submit"
                  >
                    Submit
                  </Button>
                  <LinkContainer to="/expenses">
                    <Button bsStyle="link">Back</Button>
                  </LinkContainer>
                </ButtonToolbar>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={9}>{validationMessage}</Col>
            </FormGroup>
          </Form>
        </Panel.Body>
      </Panel>}
    </>
    );
  }
}

ExpenseEdit.contextType = UserContext;

const ExpenseEditWithToast = withToast(ExpenseEdit);
ExpenseEditWithToast.fetchData = ExpenseEdit.fetchData;

export default ExpenseEditWithToast;
