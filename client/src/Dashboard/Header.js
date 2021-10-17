import React from 'react'
import Logo from '../shared/img/icon.png'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import './header.css'
import CryptoList from '../Trade/CryptoList';
import Portfolio from '../Portfolio/Portfolio';
import Watchlist from '../Watchlist/Watchlist';
import Dashboard from './dashboard';

export default function Header() {
    return (
        <Router>
            <div className="top">
                <nav className="navbar navbar-expand-lg navbar-light bg-light" id="links">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/">
                            <img src={Logo} alt="" width="50" height="50" className="d-inline-block align-text-top" />
                        </Link>
                        <Link className="navbar-brand" to="/"><h3>CryptoX</h3></Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link active" id="toplink" to="/portfolio">Portfolio</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" id="toplink" to="/watchlist">Watchlist</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" id="toplink" to="/list">Trade</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" id="toplink" to="/">Exchange</Link>
                                </li>
                            </ul>
                            <ul className="nav navbar-nav navbar-right">
                                <button type="button" id="profile" className="btn btn-light"><i className="fa fa-user-circle-o"></i></button>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <Switch>
                <Route exact path="/">
                    <Dashboard username="Sanskar jain" isverified={false}/>
                </Route>
                <Route exact path="/list">
                    <CryptoList />
                </Route>
                <Route exact path="/portfolio">
                    <Portfolio />
                </Route>
                <Route exact path="/watchlist">
                    <Watchlist />
                </Route>
            </Switch>
        </Router>
    )
}
