import React, { Component } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import styles from './styles.scss';

// Create a <Title> react component that renders an <h1> which is
// centered, palevioletred and sized at 1.5em
const Title = styled.h1`
  font-size: 1.5em;
  background: ${props => props.theme.main};
  text-align: center;
  color: palevioletred;
`;


export default class Dashboard extends Component {
  render() {
    return (
      <div>
      <Link to="nav">NAV</Link>
      <Title className={styles.title}>test
      </Title>
      <h1>Dashboard!</h1>
    </div>
    );
  }
}
