import React, { useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Main from "./components/Main";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Login from "./Login";
import UpsertItem from "./UpsertItem";
import { setData } from "./components/actions";
import axios from "axios";
import store from "./components/Store";

function App() {
  useEffect(() => {
    (async () => {
      const result = await axios("http://localhost:3003/api/get_all_items");

      store.dispatch(setData(result.data));
    })();
  }, []);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Header />
            <Main />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/settings">
            <Login />
          </Route>
          <Route
            exact
            path="/edit_item/:id_pon"
            //render={(props) => <UpsertItem {...props}/>}
            render={()=><UpsertItem/>}
          ></Route>
          <Route
            exact
            path="/insert_item/:id_pon"
            render={() => <UpsertItem/>}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
