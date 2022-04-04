const mongoose = require('mongoose');
const express = require('express');
let cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const {crypto} = require('crypto');
const promoData = require('./getPromoData');
const userData = require('./userModel');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

const dbRoute =
    'mongodb+srv://prostopopez:prostopopez@cluster0.qljpi.mongodb.net/testTrafficIsobar?retryWrites=true&w=majority';

mongoose.connect(dbRoute, {useNewUrlParser: true});

let db = mongoose.connection;

db.once('open', () => console.log('подключение к БД успешно'));

db.on('error', console.error.bind(console, 'Подключение к БД не удалось:'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));

router.get('/getPromoData', (req, res) => {
    promoData.find((err, data) => {
        if (err) return res.json({success: false, error: err});
        return res.json({success: true, data: data});
    });
});

router.post('/updatePromoData', (req, res) => {
    const {_id, update} = req.body;
    promoData.findByIdAndUpdate(_id, update, (err) => {
        if (err) return res.json({success: false, error: err});
        return res.json({success: true});
    });
});

router.delete('/deletePromoData', (req, res) => {
    const {_id} = req.body;
    promoData.findByIdAndRemove(_id, (err) => {
        if (err) return res.send(err);
        return res.json({success: true});
    });
});

router.post('/putPromoData', (req, res) => {
    let data = new promoData();

    const {
        _id,
        promoCode
    } = req.body;

    if ((!_id && _id !== 0)
        || !promoCode) {

        return res.json({
            success: false,
            error: 'INVALID INPUTS',
        });
    }
    data.promoCode = promoCode;
    data._id = _id;
    data.save((err) => {
        if (err) return res.json({success: false, error: err});
        return res.json({success: true});
    });
});

router.get('/getUserData', (req, res) => {
    userData.find((err, data) => {
        if (err) return res.json({success: false, error: err});
        return res.json({success: true, data: data});
    });
});

router.post('/updateUserData', (req, res) => {
    const { _id, update } = req.body;
    userData.findByIdAndUpdate(_id, update, (err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

router.post('/putUserData', (req, res) => {
    let data = new userData();

    const {
        id,
        username,
        password,
        promos_id
    } = req.body;

    if ((!id && id !== 0) || !username || !password) {
        return res.json({
            success: false,
            error: 'INVALID INPUTS',
        });
    }
    data.username = username;
    data.password = password;
    data.promos_id = promos_id;
    data.id = id;
    data.save((err) => {
        if (err) return res.json({success: false, error: err});
        return res.json({success: true});
    });
});

app.use('/api', router);

app.listen(API_PORT, () => console.log(`Прослушивается порт ${API_PORT}`));