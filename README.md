# SwanBot

**WARNING:** this is not good code :) it has no tests & is somewhat unorganized.

SwanBot is a lil Twitch bot I made for handling commands. The coolest command is that it fetches your speedrun PBs for a given game from therun.gg!

# How To Use

This is generally **not for broad use**, but all you need to do really is fill in the example ENV file with real values.

## OAuth Token

Visit this URL (replacing the `xxxxxx` values with your real values) to get your OAuth token. You must be logged in as the bot account you want to use.

https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=xxxxxx&redirect_uri=xxxxxx&scope=user%3Abot+user%3Aread%3Achat+user%3Awrite%3Achat+channel%3Abot
