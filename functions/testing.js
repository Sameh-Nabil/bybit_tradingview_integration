const { RestClient } = require("bybit-api")

const API_KEY = "ro7K5Ocq0gdX1StLu3"
const PRIVATE_KEY = "EmDd1aF7tk4rZRFpv9cTT9Xl7Xyz8i0AUVoi"

const client = new RestClient(API_KEY, PRIVATE_KEY);

const orderDetails = {side: "Buy", qty: 1000, take_profit: 20000.00, stop_loss: 10000.00, order_link_id: "I_AM_A_TEST_1"}

const createOrder = (details) => {
    const orderDetails = { side: details.side, symbol: "BTCUSD", order_type: "Market", qty: details.qty, time_in_force: "ImmediateOrCancel", take_profit: details.take_profit, stop_loss: details.stop_loss, order_link_id: details.order_link_id }
    client.changeUserLeverage({symbol: "BTCUSD", leverage: 100}).then((res) => {
        console.log(res);
        client.placeActiveOrder(orderDetails).then((res) => console.log(res)).catch((err) => console.error(`placeActiveOrder Error: ${err}`))
    }).catch((err) => console.error(`changeUserLeverage Error: ${err}`))    
}

createOrder(orderDetails)