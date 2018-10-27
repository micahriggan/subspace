import { createBrowserHistory } from "history";
import * as React from "react";
import { Route, Router, Switch } from "react-router";
import { MainPage } from "./containers/MainPage/MainPage";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
const customHistory = createBrowserHistory();

class App extends React.Component {
  public render() {
    return (
      <Router history={customHistory}>
        <Switch>
          <Route exact={true} path="/" component={MainPage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
