import { CLIENT_ID, OAUTH_TOKEN } from "../config.js";

export default async function getChannelCategory(id) {
    console.log(`Getting channel info for ${id}`);
    
    const response = await fetch(
        `https://api.twitch.tv/helix/channels?broadcaster_id=${id}`,
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + OAUTH_TOKEN,
                'Client-Id': CLIENT_ID,
                'Content-Type': 'application/json'
            },
        }
    );
    
    if (response.status != 200) {
        let data = await response.json();
        console.error("Failed to get channel info. API call returned status code " + response.status);
        console.error(data);
        process.exit(1);
    }
    
    const data = await response.json();
    console.log(data);
    
    const [ channel ] = data.data;
    
    return channel.game_name;
}
