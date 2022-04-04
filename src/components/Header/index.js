import React from 'react';
import classnames from 'classnames/bind';
import enhanceWithClickOutside from 'react-click-outside';
import axios from 'axios';
import {ReactSVG} from 'react-svg'
import style from './style.css';
import styleMain from '../../style/main.css';

const cn = classnames.bind(style, styleMain);

class Header extends React.Component {
    constructor() {
        super();

        this.state = {
            dataUsers: [],
            id: 0,
            username: null,
            password: null,
            isModalOpen: false,
            isToggleReg: false,
            intervalIsSet: false,
        };

        this.onCheckUser = this.onCheckUser.bind(this);
    }

    componentDidMount() {
        this.getDataFromDbUsers();

        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getDataFromDbUsers(), 1000);
            this.setState({intervalIsSet: interval});
        }
    }

    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet);
            this.setState({intervalIsSet: null});
        }
    }

    getDataFromDbUsers = () => {
        fetch('http://localhost:3001/api/getUserData')
            .then((data) => data.json())
            .then((res) => this.setState({dataUsers: res.data}));
    };

    putDataToDbUsers = (username, password) => {
        let currentIds = this.state.dataUsers.map((data) => data.id);
        let idToBeAdded = 0;
        while (currentIds.includes(idToBeAdded)) {
            ++idToBeAdded;
        }

        axios.post('http://localhost:3001/api/putUserData', {
            id: idToBeAdded,
            username: username,
            password: password
        });
    };

    handleClickOutside() {
        this.setState({
            isModalOpen: false
        });
    }

    toggleModal = () => {
        this.setState(
            prevState => ({
                isModalOpen: !prevState.isModalOpen
            })
        );
    };

    toggleReg = (isToggleReg) => {
        this.setState({
            isToggleReg
        })
    };

    onCheckUser = (e, username, password) => {
        e.preventDefault();

        const {dataUsers} = this.state;
        let logged = false;

        const isUserCorrect = dataUsers.map(singleData => {
            if (singleData.username == username && singleData.password == password) {
                return [true, singleData.username];
            }
        });

        isUserCorrect.map(isUser => {
            if (isUser) {
                logged = true;
                alert(`Вы вошли под псевдонимом ${username}`);
                this.props.onChangeUser(username);
                this.setState({
                    isModalOpen: false
                });
            }
        })

        if (!logged) {
            alert('Вы ввели что-то неправильно');
        }
    };

    logOut = () =>{
        this.props.onChangeUser(null);
    }

    render() {
        const {
            isModalOpen,
            isToggleReg
        } = this.state;

        const {
            currentUser
        } = this.props;

        return <header className={cn(`header`)}>
            <div
                className={cn(`modal`, {isModalOpen, isToggleReg})}
            >
                <div className={cn('modalContent')}>
                    <div className={'log-in'}>
                        <form>
                            {currentUser == null
                                ? <div className={cn('notLogged')}>
                                    <input type={'text'} onChange={(e) => this.setState({username: e.target.value})}
                                           placeholder={'Введите ваш логин'} required={true}/>
                                    <input type={'password'} onChange={(e) => this.setState({password: e.target.value})}
                                           placeholder={'Введите ваш пароль'} required={true}/>
                                    <button
                                        onClick={(e) => this.onCheckUser(e, this.state.username, this.state.password)}
                                        className={'green'}>Войти
                                    </button>
                                </div>
                                : <div className={cn('ifLogged')}>
                                    <p>{currentUser}</p>
                                    <button
                                        onClick={(e) => this.logOut()}
                                        className={'green'}>Войти под другим псевдонимом
                                    </button>
                                </div>
                            }
                        </form>
                        <button onClick={() => {
                            this.toggleReg(true);
                        }} className={'purple'}>Создать пользователя
                        </button>
                    </div>
                    <div className='reg-in'>
                        <form>
                            <input type={'text'} onChange={(e) => this.setState({username: e.target.value})}
                                   placeholder={'Введите новый логин'} required={true}/>
                            <input type={'password'} onChange={(e) => this.setState({password: e.target.value})}
                                   placeholder={'Введите новый пароль'} required={true}/>
                            <button onClick={() => this.putDataToDbUsers(this.state.username, this.state.password)}
                                    className={'green'}>Зарегистрироваться
                            </button>
                        </form>
                        <button onClick={() => this.toggleReg(false)} className={'purple'}>Вернуться к авторизации
                        </button>
                    </div>
                </div>
            </div>
            <div className={'mainWrapper'}>
                <div className={cn(`userToggle`)}>
                    <div
                        onClick={() => this.toggleModal()}
                        className={cn('mainLink')}
                    >
                        <ReactSVG
                            src="../img/userIcon.svg"
                            beforeInjection={(svg) => {
                                svg.classList.add('mainIcon')
                            }}
                        />
                    </div>
                </div>
            </div>
        </header>;
    }
}

export default enhanceWithClickOutside(Header);
