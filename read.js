import getAura from './commands/aura.js';
import { getPBMap } from './commands/therun.gg/pb.js';
import sendChatMessage from './send.js'
import asciiAlphabet from './utilities/asciiAlphabet.js';
import getChannelCategory from './utilities/channel.js';

export default async function handleChatMessage(event) {
    const msg = asciiAlphabet(event.message.text)
        // Sometimes getting zero-width spaces????? Only sometimes?????
        // FIXME: this could be a problem for e.g. emoji, or other unicode
        .replace(/[^\x00-\x7F]/g, "")
        .trim();
    const splitted = msg.split(' ');
    const command = splitted.shift();
    
    const commands = new Map([
        [
            '!pb',
            async () => {
                const category = msg.substring(3).trim() || await getChannelCategory(event.broadcaster_user_id);
                const allPBs = await getPBMap(event.broadcaster_user_name);
                const PBs = allPBs.get(category);
                
                if (!PBs) {
                    sendChatMessage(
                        event.broadcaster_user_id,
                        `No PB found for ${category}`
                    );
                    return;
                }
                
                const times = [];
                for (const category of PBs.keys()) {
                    times.push(`${category}: ${PBs.get(category)}`);
                }
                
                sendChatMessage(
                    event.broadcaster_user_id,
                    `${category} PBs: ${times.join(' ⭐️ ')}`
                );
            },
        ],
        [
            '!aura',
            () => {
                const name = splitted[0] || event.chatter_user_name;
                
                sendChatMessage(
                    event.broadcaster_user_id,
                    getAura(name)
                );
            }
        ],
    ]);
    
    const callable = commands.get(command);
    callable?.();
}
