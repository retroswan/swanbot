import WebSocket from 'ws';
import handleChatMessage from './read.js'
import { BOT_USER_ID, OAUTH_TOKEN, CLIENT_ID, CHAT_CHANNEL_USER_IDS, EVENTSUB_WEBSOCKET_URL } from './config.js';

var websocketSessionID;

// Start executing the bot from here
(async () => {
    // Verify that the authentication is valid
    await getAuth();

    // Start WebSocket client and register handlers
    const websocketClient = startWebSocketClient();
})();

// WebSocket will persist the application loop until you exit the program forcefully

async function getAuth() {
    // https://dev.twitch.tv/docs/authentication/validate-tokens/#how-to-validate-a-token
    let response = await fetch('https://id.twitch.tv/oauth2/validate', {
        method: 'GET',
        headers: {
            'Authorization': 'OAuth ' + OAUTH_TOKEN
        }
    });

    if (response.status != 200) {
        let data = await response.json();
        console.error("Token is not valid. /oauth2/validate returned status code " + response.status);
        console.error(data);
        process.exit(1);
    }

    console.log("Validated token.");
}

function startWebSocketClient() {
    let websocketClient = new WebSocket(EVENTSUB_WEBSOCKET_URL);

    websocketClient.on('error', console.error);

    websocketClient.on('open', () => {
        console.log('WebSocket connection opened to ' + EVENTSUB_WEBSOCKET_URL);
    });

    websocketClient.on('message', (data) => {
        handleWebSocketMessage(JSON.parse(data.toString()));
    });

    return websocketClient;
}

function handleWebSocketMessage(data) {
    console.log(data);
    switch (data.metadata.message_type) {
        case 'session_welcome': // First message you get from the WebSocket server when connecting
            websocketSessionID = data.payload.session.id; // Register the Session ID it gives us

            // Listen to EventSub, which joins the chatroom from your bot's account
            CHAT_CHANNEL_USER_IDS.map(userId => {
                registerEventSubListeners(userId, 'channel.chat.message');
                // FIXME: get reward redeem permissions working
                // registerEventSubListeners(userId, 'channel.channel_points_custom_reward_redemption.add');
            })
            break;
        case 'notification': // An EventSub notification has occurred, such as channel.chat.message
            switch (data.metadata.subscription_type) {
                case 'channel.chat.message':
                    handleChatMessage(data.payload.event);
                    break;
                case 'channel.channel_points_custom_reward_redemption.add':
                    console.log(data);
                    break;
            }
            break;
    }
}

async function registerEventSubListeners(userId, type) {
    let response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + OAUTH_TOKEN,
            'Client-Id': CLIENT_ID,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: type,
            version: '1',
            condition: {
                broadcaster_user_id: userId,
                user_id: BOT_USER_ID
            },
            transport: {
                method: 'websocket',
                session_id: websocketSessionID
            }
        })
    });

    if (response.status != 202) {
        let data = await response.json();
        console.error(`Failed to subscribe to ${type}. API call returned status code ${response.status}`);
        console.error(data);
        process.exit(1);
    } else {
        const data = await response.json();
        console.log(`Subscribed to ${type} [${data.data[0].id}]`);
    }
}
