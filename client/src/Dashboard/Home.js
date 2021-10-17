import React from 'react'
import Header from './Header'
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Dashboard from './Dashboard';

export default function Home() {
    return (
        <Router>
        <div>
            <Header />
            <Switch>
                <Route exact path="/">
                    <Dashboard/>
                </Route>
            </Switch>
        </div>
        </Router>
    )
}
