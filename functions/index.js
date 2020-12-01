const functions = require('firebase-functions');
const { RestClient } = require("bybit-api");

const API_KEY = functions.config["bybit"]["api_key"];
const PRIVATE_KEY = functions.config["bybit"]["private_key"];

const client = new RestClient(API_KEY, PRIVATE_KEY);



exports.alert = functions.region("europe-west1").https.onRequest((request, response) => {
    functions.logger.info(request.body);
    try {
        if (request.body.side == null) {
            var orderDetails = JSON.parse(request.body);
        } else {
            var orderDetails = request.body;
        }
    } catch (err) {
        functions.logger.error(err);
        response.status(500);
        response.send(`Error: ${err}`)
        return;
    }
    createOrder({ details: orderDetails, response: response });


})

const createOrder = ({ details, response }) => {
    const orderDetails = { side: details.side, symbol: "BTCUSD", order_type: "Market", qty: details.qty, time_in_force: "ImmediateOrCancel", take_profit: (details.price + details.take_profit), stop_loss: (details.price + details.stop_loss), order_link_id: details.order_link_id }
    client.changeUserLeverage({ symbol: "BTCUSD", leverage: 100 }).then((res) => {
        console.log(res);
        client.placeActiveOrder(orderDetails).then((res) => {
            console.log(res);
            res.ret_code != 0 ? response.status(500) : response.status(200);
            response.send(res);
        }).catch((err) => console.error(`placeActiveOrder Error: ${err}`))
    }).catch((err) => console.error(`changeUserLeverage Error: ${err}`))
}