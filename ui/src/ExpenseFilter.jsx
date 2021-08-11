import React from 'react';
import URLSearchParams from 'url-search-params';
import { withRouter } from 'react-router-dom';
import {
  ButtonToolbar, Button, FormGroup, FormControl, ControlLabel, InputGroup,
  Row, Col,
} from 'react-bootstrap';

class ExpenseFilter extends React.Component {
  constructor({ location: { search } }) {
    super();
    const params = new URLSearchParams(search);
    this.state = {
      category: params.get('category') || '',
      amountMin: params.get('amountMin') || '',
      amountMax: params.get('amountMax') || '',
      changed: false,
    };

    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onChangeAmountMin = this.onChangeAmountMin.bind(this);
    this.onChangeAmountMax = this.onChangeAmountMax.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search) {
      this.showOriginalFilter();
    }
  }

  onChangeCategory(e) {
    this.setState({ category: e.target.value, changed: true });
  }

  onChangeAmountMin(e) {
    const effortString = e.target.value;
    if (effortString.match(/^\d*$/)) {
      this.setState({ amountMin: e.target.value, changed: true });
    }
  }

  onChangeAmountMax(e) {
    const effortString = e.target.value;
    if (effortString.match(/^\d*$/)) {
      this.setState({ amountMax: e.target.value, changed: true });
    }
  }

  showOriginalFilter() {
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search);
    this.setState({
      category: params.get('category') || '',
      amountMin: params.get('amountMin') || '',
      amountMax: params.get('amountMax') || '',
      changed: false,
    });
  }

  applyFilter() {
    const { category, amountMin, amountMax } = this.state;
    const { history, urlBase } = this.props;
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (amountMin) params.set('amountMin', amountMin);
    if (amountMax) params.set('amountMax', amountMax);

    const search = params.toString() ? `?${params.toString()}` : '';
    history.push({ pathname: urlBase, search });
  }

  render() {
    const { category, changed } = this.state;
    const { amountMin, amountMax } = this.state;
    return (
      <Row>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>category:</ControlLabel>
            <FormControl
              componentClass="select"
              value={category}
              onChange={this.onChangeCategory}
            >
              <option value="">(All)</option>
              <option value="Housing">Housing</option>
              <option value="Transportation">Transportation</option>
              <option value="Dinning">Dinning</option>
              <option value="Groceries">Groceries</option>
              <option value="Savings">Savings</option>
              <option value="Entertainment">Entertainment</option>
              <option value="UtilitiesAndPhone">Utilities & Phone</option>
              <option value="Medical">Medical</option>
              <option value="Clothing">Clothing</option>
              <option value="Misc">Misc</option>
            </FormControl>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Expense between:</ControlLabel>
            <InputGroup>
              <FormControl value={amountMin} onChange={this.onChangeAmountMin} />
              <InputGroup.Addon>-</InputGroup.Addon>
              <FormControl value={amountMax} onChange={this.onChangeAmountMax} />
            </InputGroup>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>&nbsp;</ControlLabel>
            <ButtonToolbar>
              <Button bsStyle="primary" type="button" onClick={this.applyFilter}>
                Apply
              </Button>
              <Button
                type="button"
                onClick={this.showOriginalFilter}
                disabled={!changed}
              >
                Reset
              </Button>
            </ButtonToolbar>
          </FormGroup>
        </Col>
      </Row>
    );
  }
}

export default withRouter(ExpenseFilter);
