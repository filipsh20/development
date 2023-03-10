const express = require('express');
const paypal = require('paypal-rest-sdk');

const app = express();

//settings
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//middlewars
app.use(express.urlencoded({extended: false}));
require('dotenv').config();
require('./database');


paypal.configure({
    mode: 'sandbox',
    client_id: 'ATEBykAgb0ZHqY6tvvEz2F0OOSPH4hF1vqGO-59ks0sqxtSITSEbh1-Zc7vPsmib_BxVIBvS2eqE2Fts',
    client_secret: 'ECEw7XaRRXn0SbazTBtFWsVCPAAnVMDSHLmuK3FV_-0D4hSAR2XAni47PMz6HraT-CA5UMtsnCuyiV6P'
})

const payment = (req, res) => {

    const {amount} = req.body;

    paypal.payment.create({
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        transactions: [{
            amount: {
                total: amount,
                currency: 'USD'
            }
        }],
        redirect_urls: {
            return_url: `${process.env.URL}/success`,
            cancel_url: `${process.env.URL}/failure`
        }
    }, (error, success) => {
        if(error) {
            console.log(error)
        }else{
            const approvalUrl = success.links.find((link) => link.rel === 'approval_url').href;
            res.redirect(approvalUrl);
        }
    });
};

const success = (req, res) => {
    const paymentId = req.query.paymentId;
    const payerId = req.query.PayerID;
    console.log(req)

    paypal.payment.execute(paymentId, { payer_id: payerId }, (error, payment) => {
        if (error) {
        console.error(error);
        } else {
        console.log(payment);
        res.send('Pago realizado correctamente');
        }
    });


}

//routes
app.get('/', (req, res, next) => {res.render('index')})
app.post('/payment', payment);
app.get('/success', success);
app.get('/failure', (req, res) => {res.send('Payment canceled')});

app.listen(app.get('port'), () => console.log('Server running'));