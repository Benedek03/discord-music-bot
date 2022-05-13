for the list of commands visit [commands.md](./commands.md)

### Building image locally
you can build the image like this:
```
docker build . -t benedek03/discord-music-bot
```
### Running a container
you can then run the container (it will automaticly register the slash commands) like this:
```
docker run -d --name discord-music-bot benedek03/discord-music-bot\
    -e DISCORD_TOKEN={DISCORD_TOKEN}\
    -e MONGO_URI={MONGO_URI}
```
you can register the commands in only a test guild like this:
```
docker run -d --name discord-music-bot benedek03/discord-music-bot\
    -e DISCORD_TOKEN=$DISCORD_TOKEN\
    -e MONGO_URI=$MONGO_URI\
    -e TESTGUILDID=$TESTGUILDID
```
### Deleting slash commands
you can delete the slash commands like this:
```
docker run benedek03/discord-music-bot\
    -e DELETE_COMMANDS="TRUE"
```