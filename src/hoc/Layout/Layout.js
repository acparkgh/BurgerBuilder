import React from 'react';
import Aux from '../Aux/Aux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import classes from './Layout.css';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends React.Component {

  state = {
    showSideDrawer: false,
  }

  sideDrawerCloseHandler = () => {
    this.setState({ showSideDrawer: false });
  }

  sideDrawerToggleHandler = () => {
    this.setState( (prevState) => {
      return ({ showSideDrawer: !prevState.showSideDrawer })
    } )
  }

  render() {
    return (
    
      <Aux>
        <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
        <SideDrawer open={this.state.showSideDrawer} 
                    closed={this.sideDrawerCloseHandler} 
        />
        <main className={classes.Content} >
          {this.props.children}
        </main>
      </Aux>
 
   )
  }
};

export default Layout;