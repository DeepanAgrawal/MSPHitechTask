import React from 'react';
import { render }  from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';

// import components
import ItemsForOrder from './containers/ItemsForOrder';

// import store
import store from './store';

const rootElement = document.getElementById('root');

render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/itemsForOrder" component={ItemsForOrder} />
    </Router>
  </Provider>,
  rootElement
);
