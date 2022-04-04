import React from 'react';
import Header from './components/Header';
import './style/main.css';


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pathname: props.history.location.pathname,
        };
    }

    componentDidMount() {
        window.h.listen((e) => {
            this.setState({
                pathname: e.pathname
            });
        });
    }

    render() {
        const {
            pathname,
        } = this.state;

        const {
            currentUser,
            onChangeUser
        } = this.props;

        return <React.Fragment>
            <Header
                pathname={pathname}
                currentUser={currentUser}
                onChangeUser={onChangeUser}
            />
            <main>
                {React.cloneElement(this.props.children, currentUser)}
            </main>
        </React.Fragment>;
    }
}

export default App;
