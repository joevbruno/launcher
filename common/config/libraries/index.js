// import "babel-runtime";
import React, { Component, PropTypes } from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider, connect } from "react-redux";
import thunkMiddleware from "redux-thunk";
import promiseMiddleware from "redux-promise";
import { AppContainer } from "react-hot-loader";
import styled, { ThemeProvider, keyframes } from 'styled-components';

export {
    // React
    React,
    Component,
    PropTypes,
    // React DOM
    render,
    // redux
    Provider,
    connect,
    createStore,
    applyMiddleware,
    thunkMiddleware,
    promiseMiddleware,
    compose,
    // Dev
    AppContainer,
    // React Native (for Web)

    // Styled Components
    styled,
    ThemeProvider,
    keyframes
}
