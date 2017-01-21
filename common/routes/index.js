import React from 'react';
import Match from 'react-router/Match';
import Miss from 'react-router/Miss';
import Layout from '../containers/layout';
import handleRoute from './handleRoute';
import Navigation from '../modules/navigation';
import { Link } from 'react-router';

const RouteNotFound = () => (<h1>Not Found</h1>);
const getAsync = cb => handleRoute(() => new Promise(cb));
const landing = getAsync(resolve => require.ensure([], () => resolve({ landing: require('../modules/dashboard/index.js').default }), 'landing'));

const Routes = () => (
  <Layout>
    <Link to="nav">NAV</Link>
    <Navigation />
    <Match
      exactly
      pattern={'/'}
      component={landing}
    />
    <Match
      exactly
      pattern={'/nav'}
      component={Navigation}
    />
    <Miss component={RouteNotFound} />
  </Layout>
);

export default Routes;
