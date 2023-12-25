# echoCTF headshot discord announcer
A small nodejs application to announce your echoCTF instance headshots through a discord webhook.

This simple nodejs script queries the database and posts updates to a discord channel webhook.

The messages arrive on discord and appear like so
![Discord message](image.png)

The script supports bypassing the default username and avatar that the messages appear from.

## Configuration
```json
{
  "db_host": "localhost",
  "db_user": "root",
  "db_pass": "",
  "db_name": "echoCTF",
  "lastID": 0,
  "DiscordHook": "https://discord.com/api/webhooks/",
  "botName": null,
  "botAvatarUrl": null
}
```

The following environment variables can be used to bypass the configuration
* `CONFIG_PATH` path to configuration file (default: `./config.json`)
* `lastID` the ID of the last headshot to announce (default: `0` means all headshots).