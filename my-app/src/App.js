import React from "react";
import { Route, Switch } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import WrappedPage from "./components/WrappedPage";

function App() {
    return (
        <Switch>
            <Route path="/" exact component={LoginPage} />
            <Route path="/wrapped" exact component={WrappedPage} />
        </Switch>
    );
}

export default App;