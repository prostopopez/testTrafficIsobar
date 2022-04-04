import '@babel/polyfill';
import ReactDOM from 'react-dom';
import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import router from './router';
import App from './App';
import {store} from "core-js/internals/reflect-metadata";

const history = createBrowserHistory();
window.h = history;

class Root extends React.Component {
    constructor(props) {
        super(props);

        // localStorage.clear()
        let storedUser = localStorage.getItem('currentUser');

        console.log(storedUser);
        this.onChangeUser = this.onChangeUser.bind(this);
        this.state = {
            currentUser: storedUser
                ? storedUser
                : null
        };
    }

    onChangeUser(currentUser) {
        if (currentUser) {
            localStorage.setItem('currentUser', currentUser);
        } else {
            localStorage.clear();
        }
        this.setState({currentUser});
    }

    render() {
        const {
            currentUser
        } = this.state;

        return <App history={history} currentUser={currentUser} onChangeUser={this.onChangeUser}>
            <Router history={history}>
                <Switch>
                    {router.map(({
                                     path, exact, component: C, ...rest
                                 }) => (
                        <Route
                            key={path}
                            path={path}
                            exact={exact}
                            render={(props) => (
                                <C
                                    currentUser={currentUser}
                                    {...props}
                                    {...rest}
                                    store={this.store}
                                    path={path}
                                />
                            )}
                        />
                    ))}
                </Switch>
            </Router>
        </App>;
    }
}

if (!window.ssr) {
    ReactDOM.hydrate(<Root/>, document.getElementById(`root`));
}
