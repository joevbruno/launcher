import { createLogic } from 'redux-logic';

const ADD_USER = 'ADD';
const USER_EXISTS_ERROR = 'ERROR';

const validationLogic = createLogic({
  type: ADD_USER,
  validate({ getState, action }, allow, reject) {
    const user = action.payload;
    if (!getState().users[user.id]) { // can also hit server to check
      allow(action);
    } else {
      reject({ type: USER_EXISTS_ERROR, payload: user, error: true });
    }
  }
});

export default [validationLogic];
