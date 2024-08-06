import { getSixteenStarPB } from './pb.js';
import sendChatMessage from './send.js'

export default async function handleChatMessage(event) {
    // First, print the message to the program's console.
    console.log(`MSG #${event.broadcaster_user_login} <${event.chatter_user_login}> ${event.message.text}`);

    // Then check to see if that message was "HeyGuys"
    const msg = event.message.text.trim();
    switch (msg) {
        case 'HeyGuys': {
            sendChatMessage('VoHiYo');
        } break;
        
        case '!sixteen': {
            sendChatMessage(getSixteenStarPB());
        } break;
        
        case '!pb': {
            
        } break;
    }
}
