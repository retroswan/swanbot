import getAura from './commands/aura.js';
import { getPBMap } from './commands/therun.gg/pb.js';
import sendChatMessage from './send.js'
import asciiAlphabet from './utilities/asciiAlphabet.js';
import getChannelCategory from './utilities/channel.js';
import { kvsEnvStorage } from "@kvs/env";
import toSlug from './utilities/toSlug.js';

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
                const streamCategory = msg.substring(3) || await getChannelCategory(event.broadcaster_user_id);
                const allPBs = await getPBMap(event.broadcaster_user_name);
                const PBs = allPBs.get(toSlug(streamCategory));
                
                if (!PBs) {
                    sendChatMessage(
                        event.broadcaster_user_id,
                        `No PB found for ${streamCategory}`
                    );
                    return;
                }
                
                const game = PBs.game;
                
                const times = [];
                for (const category of PBs.pbs.keys()) {
                    times.push(`${category}: ${PBs.pbs.get(category)}`);
                }
                
                sendChatMessage(
                    event.broadcaster_user_id,
                    `${game} PBs: ${times.join(' ⭐️ ')}`
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
        [
            '!set',
            async () => {
                const storage = await kvsEnvStorage({
                    name: 'points',
                    version: 1,
                });
                
                const key = splitted[0] || 'testing';
                let value = await storage.get(key) || 0;
                
                await storage.set(key, ++value);
                
                sendChatMessage(
                    event.broadcaster_user_id,
                    `Setting "${key}" to "${value}"`
                );
            }
        ],
        [
            '!read',
            async () => {
                const storage = await kvsEnvStorage({
                    name: 'points',
                    version: 1,
                });
                
                const key = splitted[0] || 'testing';
                const value = await storage.get(key);
                
                sendChatMessage(
                    event.broadcaster_user_id,
                    `Value "${key}" is "${value}"`
                );
            }
        ],
    ]);
    
    const callable = commands.get(command);
    callable?.();
}
