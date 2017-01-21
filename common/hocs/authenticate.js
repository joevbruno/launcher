/* @flow */
import React, { Component, PropTypes } from 'react';
import Redirect from 'react-router/Redirect';
import { connect } from 'react-redux';

export default function authenticate(Comp: ReactElement, allowedPermissions: Array<String>) {
  @connect(state => ({ ...state.user }))
  class Authenticate extends Component {
    static propTypes = {
      email: PropTypes.string,
      isTokenValid: PropTypes.bool,
      permissions: PropTypes.array // eslint-disable-line
    }

    isAuthenticated() {
      const { email, isTokenValid } = this.props;
      return email && isTokenValid;
    }

    hasSufficentPermissions() {
      const { permissions = [] } = this.props;
      return permissions.map(p => allowedPermissions.includes(p)).includes(true);
    }

    render() {
      const canProceed = this.isAuthenticated();
      return canProceed
        ? (<Comp {...this.props} />)
        : (<Redirect to="/" />);
    }
  }

  return Authenticate;
}
