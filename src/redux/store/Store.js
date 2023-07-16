import Reducer from "../reducer/Reducer";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
const middleware = [thunk];
const composeEnhancers = compose;

const store = createStore(
  Reducer,
  composeEnhancers(applyMiddleware(...middleware))
);
export default store;
