# Commands
### /p <url: string>
Plays the audio of of the YouTube video. This command only works with YouTube URLs.

### /q
Lists the songs in the queue.

### /d
Stops the queue and the bot disconnects.

### /s (<n: number>)
Skips to nth song in the queue.

### /rm  <n: number>
Removes nth song in the queue.

### /lq
Toggles loopqueue.

### /ls
Toggles loopsong.

### /sr <searchTerm: string> 
Lists top 5 videos found on YouTube.

### /psr <searchTerm: string> 
Plays first video found on YouTube.

## PLaylist commands
### /create <name: string>
Creates a playlist with the given name.

### /remove <name: string> 
Removes the playlist from the server.

### /add <name: string, url: string>
Adds the song to the playlist. Only works with YouTube URLs.

### /removesong <name: string, n: number>
Removes the nth song from the playlist.

### /playlists
Lists all of the playlists in this server.

### /songs <name: string>
Lists all of the songs in the playlist.

### /getid <name: string>
Gives the id of a playlist.

### /link <name: string, id: string>
Links a playlist with the given name.

### /play <name: string>
Plays the playlist.

### /replacequeue <name: string>
Replaces the queue with the playlist.

