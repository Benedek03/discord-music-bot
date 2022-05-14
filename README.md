for the list of commands visit [commands.md](./commands.md)

### Building image locally
you can build the image like this:
```
docker build . -t benedek03/discord-music-bot
```


### Running a container
to run the container you have to create a .env file first
```
DISCORD_TOKEN=
MONGO_URI=
```
then you can then run the container (it will automaticly register the slash commands) like this:
```
docker run -d --env-file .env --name discord-music-bot benedek03/discord-music-bot
```

### Deleting slash commands
if you want to delete the slash commands add this to your .env file
```
DELETE_COMMANDS="TRUE"
```

#### debug 
if you want to register the commands  in only one server add this to your .env file
``` 
TESTGUILDID=
```
