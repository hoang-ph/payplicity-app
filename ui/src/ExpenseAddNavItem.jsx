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
    const form = document.forms.issueAdd;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };
    const query = `mutation issueAdd($issue: IssueInputs!) {
      issueAdd(issue: $issue) {
        id
      }
    }`;

    const { showError } = this.props;
    const data = await graphQLFetch(query, { issue }, showError);
    if (data) {
      const { history } = this.props;
      history.push(`/edit/${data.issueAdd.id}`);
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
                <FormControl name="expense" autoFocus />
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
                    <option value="misc"> Misc</option>
                    <option value="housing"> Housing</option>
                    <option value="transportation">Transportation</option>
                    <option value="dining">Dining</option>
                    <option value="savings">Savings</option>
                    <option value="groceries">Groceries</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="utility">Utility & Phone</option>
                    <option value="medical">Medical</option>
                    <option value="clothing">Clothing</option>
                  </FormControl>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Date</ControlLabel>
                <FormControl name="title" placeholder="mm/dd/yyyy" />
              </FormGroup>
              <FormGroup>
                <ControlLabel>File</ControlLabel>
                <FormControl name="file" type="file" placeholder="No file chosen" />
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
