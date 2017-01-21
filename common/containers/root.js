/* eslint-disable no-console */
import { React, Provider, ThemeProvider } from 'libraries';
// import configureStore from '../redux/store/configureStore';
// import Routes from '../routes';
// import theme from '../styles/theme.js';

const errorLoading = err => console.error('Dynamic page loading failed', err);
const loadRoute = cb => module => cb(null, module.default);

const initialState = {};
// const store = configureStore(initialState);

// window.peakState = () => store.getState();

const App = () => (
   <div>hi</div>
);

export default App;

/*
 <ThemeProvider theme={theme}>
        <Provider store={store}>
            <Routes />
        </Provider>
    </ThemeProvider>
 */
