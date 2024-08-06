import { BOT_USER_ID, OAUTH_TOKEN, CLIENT_ID, CHAT_CHANNEL_USER_ID } from './config.js';

let counter = 0;

export default async function sendChatMessage(chatMessage) {
    let response = await fetch('https://api.twitch.tv/helix/chat/messages', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + OAUTH_TOKEN,
            'Client-Id': CLIENT_ID,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            broadcaster_id: CHAT_CHANNEL_USER_ID,
            sender_id: BOT_USER_ID,
            message: `${chatMessage} [${++counter}]`
        })
    });

    if (response.status != 200) {
        let data = await response.json();
        console.error("Failed to send chat message");
        console.error(data);
    } else {
        console.log("Sent chat message: " + chatMessage);
    }
}
