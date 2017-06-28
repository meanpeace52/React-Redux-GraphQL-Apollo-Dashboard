import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactFela from 'react-fela';
import { createStore, Store, applyMiddleware, Middleware, GenericStoreEnhancer, compose, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

import { DashboardComponent } from '@adminide-stack/client-react';
import { reducers, Store as StoreState } from '@adminide-stack/client-redux';
import createRenderer from './fela-renderer';

import './index.css';
import './layout.css';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3000/graphql',
});

const wsClient = new SubscriptionClient(`ws://localhost:3000/`, {
    reconnect: true,
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient,
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
});

const middlewares: Middleware[] = [
  thunk,
  client.middleware(),
  // logicMiddleware,
];

const enhancers: GenericStoreEnhancer[] = [
  applyMiddleware(...middlewares),
];

const reduxExtentionComposeName: string = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';
const composeEnhancers =
  window[reduxExtentionComposeName] ?
    window[reduxExtentionComposeName] : compose;

const store = createStore(
  combineReducers({
    ...reducers,
    apollo: client.reducer(),
  }),
  {} as StoreState.All,
  composeEnhancers(...enhancers),
);


// Commented out ("let HTML app be HTML app!")
window.addEventListener('DOMContentLoaded', () => {
    const rootEl = document.getElementById('redux-app-root');
    const mountNode = document.getElementById('stylesheet');
    const renderer = createRenderer(document.getElementById('font-stylesheet'));

    if (rootEl) {
      ReactDOM.render(
          <ReactFela.Provider renderer={renderer} mountNode={mountNode}>
              <ApolloProvider store={store} client={client}>
                  <DashboardComponent />
              </ApolloProvider>
          </ReactFela.Provider>,
          rootEl,
      );
  }
});
