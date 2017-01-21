import React, { PropTypes, Component } from 'react';
import Helmet from 'react-helmet';

export default class Layout extends Component {
  static propTypes = {
    children: PropTypes.any
  };

  render() {
    const { children } = this.props;

    return (
      <main>
        <Helmet
          htmlAttributes={{ lang: 'en', amp: undefined }} // amp takes no value
          title={'My Title'}
        />
        {children}
      </main>
    );
  }
}
