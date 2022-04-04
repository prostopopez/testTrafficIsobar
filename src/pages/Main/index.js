import React from 'react';
import '../../style/main.css';
import './style.css';
import axios from 'axios';
import mongoose from 'mongoose';
import classnames from 'classnames/bind';
import style from "../../components/Header/style.css";
import styleMain from "../../style/main.css";

const cn = classnames.bind(style, styleMain);

class MainPage extends React.Component {
    constructor() {
        super();

        this.state = {
            dataPromos: [],
            dataUsers: [],
            promo_id: null,
            promoCode: null,
            username: null,
            intervalIsSet: false
        };
    }

    componentDidMount() {
        let datas = [
            this.getDataFromDbPromo,
            this.getDataFromDbUsers
        ];

        for (let i = 0; i < datas.length; i++) {
            datas[i]();

            if (!this.state.intervalIsSet) {
                let interval = setInterval(datas[i](), 1000);
                this.setState({intervalIsSet: interval});
            }
        }
    }

    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet);
            this.setState({intervalIsSet: null});
        }
    }

    getDataFromDbPromo = () => {
        fetch('http://localhost:3001/api/getPromoData')
            .then((data) => data.json())
            .then((res) => this.setState({dataPromos: res.data}));
    };

    getDataFromDbUsers = () => {
        fetch('http://localhost:3001/api/getUserData')
            .then((data) => data.json())
            .then((res) => this.setState({dataUsers: res.data}));
    };

    putDataToDbPromo = (e, promo_id, promoCode) => {
        e.preventDefault();

        axios.post('http://localhost:3001/api/putPromoData', {
            _id: promo_id,
            promoCode: promoCode,
        });
    };

    updateDbUsers = (e, promo_id, username) => {
        e.preventDefault();

        let objIdToUpdate = null;
        parseInt(username);
        this.state.dataUsers.forEach((dat) => {
            if (dat.username == username) {
                objIdToUpdate = dat._id;
            }
        });

        console.log(promo_id, objIdToUpdate);

        axios.post('http://localhost:3001/api/updateUserData', {
            _id: objIdToUpdate,
            update: {promos_id: [promo_id]},
        });
    };

    render() {
        const {
            dataPromos,
            dataUsers
        } = this.state;

        const {
            currentUser
        } = this.props;

        return <div className={'admin'}>
            <div className={'mainWrapper'}>
                <h1>{`ЛИЧНЫЙ КАБИНЕТ`}</h1>
                <hr/>
                <div className={cn('promoBlock')}>
                    <p>{currentUser}</p>
                    {currentUser == null
                        ? <p>Авторизуйтесь</p>
                        : <form>
                            <input type={'text'} onChange={(e) => this.setState({
                                promo_id: new mongoose.Types.ObjectId(),
                                promoCode: e.target.value
                            })} placeholder={'Код:'} required={true}/>
                            <button className={cn('green')} onClick={(e) => {
                                this.putDataToDbPromo(
                                    e,
                                    this.state.promo_id,
                                    this.state.promoCode,
                                );
                                this.updateDbUsers(
                                    e,
                                    this.state.promo_id,
                                    this.state.username
                                )
                            }}>Добавить промокод
                            </button>
                        </form>
                    }
                    <div className={cn('activatedPromos')}>
                        <p className={cn('label')}>Уже активированы:</p>
                        <hr/>
                        {dataPromos.map(promo =>
                            dataUsers.map(user => {
                                if (user.username == currentUser && user.promos_id.includes(promo._id)) {
                                    return <p>{promo.promoCode}</p>
                                }
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default MainPage;
