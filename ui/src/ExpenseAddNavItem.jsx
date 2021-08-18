import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  NavItem, Glyphicon, Modal, Form, FormGroup, FormControl, ControlLabel,
  Button, ButtonToolbar, Tooltip, OverlayTrigger, InputGroup,
} from 'react-bootstrap';

import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';

class ExpenseAddNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  showModal() {
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.hideModal();
    const form = document.forms.expenseAdd;
    const { user: { email } } = this.props;
    const createdOn = form.date.value === '' ? new Date() : new Date(form.date.value);
    const expense = {
      email,
      description: form.description.value,
      amount: form.amount.value || 0.00,
      category: form.category.value,
      created: createdOn,
    };
    const query = `mutation expenseAdd($expense: ExpenseInputs!) {
      expenseAdd(expense: $expense) {
        id
      }
    }`;
    const { showSuccess, showError } = this.props;
    const data = await graphQLFetch(query, { expense }, showError);
    if (data) {
      showSuccess('Successfully added a new expense');
      setTimeout(() => {
        const { history } = this.props;
        history.push('/expenses');
      }, 1000);
    }
  }

  render() {
    const { showing } = this.state;
    const { user: { signedIn } } = this.props;
    return (
      <React.Fragment>
        <NavItem disabled={!signedIn} onClick={this.showModal}>
          <OverlayTrigger
            placement="left"
            delayShow={1000}
            overlay={<Tooltip id="create-expense">Create Expense</Tooltip>}
          >
            <Glyphicon glyph="plus" />
          </OverlayTrigger>
        </NavItem>
        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Expense</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="expenseAdd">
              <FormGroup>
                <ControlLabel>Description:</ControlLabel>
                <FormControl name="description" autoFocus />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Amount</ControlLabel>
                <InputGroup>
                  <InputGroup.Addon>$</InputGroup.Addon>
                  <FormControl name="amount" placeholder="0.00" />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Category</ControlLabel>
                <InputGroup>
                  <FormControl name="category" componentClass="select" placeholder="select">
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
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Date</ControlLabel>
                <FormControl name="date" placeholder="yyyy-mm-dd" />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button
                type="button"
                bsStyle="primary"
                onClick={this.handleSubmit}
              >
                Add
              </Button>
              <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withToast(withRouter(ExpenseAddNavItem));
