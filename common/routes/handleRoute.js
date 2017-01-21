import React, { Component } from 'react';

export default function handleRoute(getComponent) {
  return class AsyncComponent extends Component {
    constructor(props, context) {
      super(props, context);
      this.Component = null;
      this.state = { Component: null };
    }

    componentWillMount() {
      if (!this.state.Component && process.env.IS_CLIENT) {
        getComponent().then((Comp) => {
          AsyncComponent.Component = Comp;
          this.setState({ Component: Comp });
        });
      }
    }

    componentDidMount() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    render() {
      const Comp = this.state.Component;

      if (Comp) {
        const Route = Object.values(Comp)[0];
        return (<Route {...this.props} />);
      }
      return null;
    }
  };
}
