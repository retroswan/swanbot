import getAura from './commands/aura.js';
import { getPBMap, getSixteenStarPB } from './commands/therun.gg/pb.js';
import sendChatMessage from './send.js'
import getChannelCategory from './utilities/channel.js';

export default async function handleChatMessage(event) {
    // First, print the message to the program's console.
    console.log(`MSG #${event.broadcaster_user_login} <${event.chatter_user_login}> ${event.message.text}`);

    // Then check to see if that message was "HeyGuys"
    const msg = event.message.text
        // Sometimes getting zero-width spaces????? Only sometimes?????
        .replace(/[^\x00-\x7F]/g, "")
        .trim();
    
    if (msg.substring(0, 3) === '!pb') {
        const category = msg.substring(3).trim() || await getChannelCategory(event.broadcaster_user_id);
        const allPBs = await getPBMap(event.broadcaster_user_name);
        const PBs = allPBs.get(category);
        
        if (!PBs) {
            sendChatMessage(`No PB found for ${category}`);
            return;
        }
        
        const times = [];
        for (const category of PBs.keys()) {
            times.push(`${category}: ${PBs.get(category)}`);
        }
        
        sendChatMessage(`${category} PBs: ${times.join(' ⭐️ ')}`);
        
        return;
    }
    
    switch (msg) {
        case 'HeyGuys': {
            sendChatMessage('VoHiYo');
        } break;
        
        case '!sixteen': {
            sendChatMessage(await getSixteenStarPB());
        } break;
        
        case '!aura': {
            console.log('should respond with aura');
            const aura = getAura('retroswan');
            
            sendChatMessage(aura);
        } break;
    }
}
