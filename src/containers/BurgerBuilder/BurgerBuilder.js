import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
// import { UsageState } from 'react';
import Spinner from '../../components/UI/Spinner/Spinner';
// import Spinner from '../../../src/components/UI/Spinner/Spinner';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
}

class BurgerBuilder extends Component {

  state = {
    // ingredients: {
    //   salad: 0,
    //   bacon: 0,
    //   cheese: 0,
    //   meat: 0
    // },
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
  }

  componentDidMount() {
    // console.log(this.props);
    axios.get('/ingredients.json')
      .then(response => {
        this.setState({ ingredients: response.data })
      })
  };
  
  updatePurchaseState (ingredients) {
    // const ingredients = { ...this.state.ingredients };
    const sum = Object.keys(ingredients).map(igKey => {
      return ingredients[igKey]
    }).reduce( (sum, el) => { return sum + el }, 0 )
    
    this.setState({ purchasable: sum > 0 })
    
    // updatePurchaseState () {

    //   this.setState( prevState => {
    //     const prevIngredients = prevState.ingredients
    //     const sum = Object.keys(prevIngredients).map( igKey => {
    //                   return prevIngredients[igKey]
    //                 } ).reduce( (sum, el) => { return sum + el }, 0 )

    //     return { purchasable: sum > 0 }
    // } )

  }

  addIngredientHandler = (type) => {

    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = { ...this.state.ingredients };
    updatedIngredients[type] = updatedCount;

    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    
    this.setState({
      ingredients: updatedIngredients,
      totalPrice: newPrice,      
    })

    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) { return; }

    const updatedCount = oldCount -  1;
    const updatedIngredients = { ...this.state.ingredients };
    updatedIngredients[type] = updatedCount;

    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;

    this.setState({
      ingredients: updatedIngredients,
      totalPrice: newPrice,
    });

    this.updatePurchaseState(updatedIngredients);
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false })
  }
  
  purchaseContinueHandler = () => {
    // alert('You continue!');
    // this.setState({ loading: true })
    // const order = {
    //   ingredients: this.state.ingredients,
    //   price: this.state.totalPrice,
    //   customer: {
    //     name: 'Max',
    //     address: {
    //       street: '123 Main street',
    //       zipCode: '12345',
    //       country: 'UsageState',
    //     },
    //     email: 'email@myburger.com',
    //   },
    //   deliveryMethod: 'Drive Thru',
    // }

    // axios.post('/orders.json', order)
    //   .then(response => {
    //     this.setState({ loading: false, purchasing: false })
    //   })
    //   .catch(error => {
    //     this.setState({ loading: false, purchasing: false })
    //   });
   
    const queryParams = [];
    for (let i in this.state.ingredients) {
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
      // queryParams.push(i + '=' + this.state.ingredients[i]);
    }
    queryParams.push('price=' + this.state.totalPrice);
    console.log(queryParams)
    const queryString = queryParams.join('&');
    // console.log(queryString)
    this.props.history.push({
      pathname: '/checkout',
      search: '?' + queryString
    });
  }

  render() {
    const disabledInfo = { ...this.state.ingredients };
    for (let key in disabledInfo) { disabledInfo[key] = (disabledInfo[key] <= 0) };
    
    let orderSummary = null;
    let burger = <Spinner />;

    if(this.state.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchasable} 
                        ordered={this.purchaseHandler}
                        />
        </Aux>
      );
      
      orderSummary = <OrderSummary ingredients={this.state.ingredients}
                                   price={this.state.totalPrice} 
                                   purchaseCancelled={this.purchaseCancelHandler}
                                   purchaseContinued={this.purchaseContinueHandler}
                     />;
    }
    
    if(this.state.loading) {
      orderSummary = <Spinner />;
    }
    
    return (
      <Aux>
        <Modal show={this.state.purchasing} 
               modalClosed={this.purchaseCancelHandler} 
        >
          {orderSummary}
        </Modal>
          {burger}
      </Aux>
    );
  }


}

export default BurgerBuilder;