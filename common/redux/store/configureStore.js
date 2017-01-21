import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise';
import { createLogicMiddleware } from 'redux-logic';
import createLoggerMiddleware from 'redux-logger';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import rootReducer from '../reducers';
import arrLogic from '../logic';

const deps = {};

export default function configureStore(initialState) {
  const logicMiddleware = createLogicMiddleware(arrLogic, deps);
  const injectMiddleware = localDeps => ({ dispatch, getState }) => next => action =>
    next(typeof action === 'function'
      ? action({ ...localDeps, dispatch, getState })
      : action,
    );

  const errorMiddleware = () => next => (action) => {
    console.log(action);
    return next(action);
  };

  const middleware = [
    promiseMiddleware,
    logicMiddleware,
    injectMiddleware(deps),
    errorMiddleware,
    reduxImmutableStateInvariant
  ];

  const enableLogger = process.env.NODE_ENV !== 'production' && process.env.IS_CLIENT;

  // Logger must be the last middleware in chain.
  if (enableLogger) {
    const logger = createLoggerMiddleware({
      collapsed: true,
    });
    middleware.push(logger);
  }

  const store = createStore(
      rootReducer,
      initialState,
      compose(
          applyMiddleware(

          ),
          ((process.env.NODE_ENV === 'development' && window.devToolsExtension) ? window.devToolsExtension() : (f) => f) // eslint-disable-line no-process-env
      )
  );

  if (module.hot && process.env.NODE_ENV === 'development') { // eslint-disable-line no-process-env
    module.hot.accept('../reducers/index.js', () => {
      const nextRootReducer = require('../reducers/index.js').default; // eslint-disable-line global-require
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
