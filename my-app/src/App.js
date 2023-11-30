import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './components/LoginPage'; // Adjust the path based on your project structure
import WrappedPage from './components/WrappedPage'; // Adjust the path based on your project structure

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={LoginPage} />
        <Route path="/wrappedPage" component={WrappedPage} />
      </Switch>
    </Router>
  );
}

export default App;
