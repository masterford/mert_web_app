First, you need to install mongo: on a mac the easiest way to do this is:
	0. cd ~/
	1. brew update
	2. brew install mongodb
	3. mkdir -p /data/db
	4. sudo chown -R `id -un` /data/db
Second, you need to start a mongo server daemon:
	1. ~/mongodb/bin/mongod (or simply run mongod)
Next, you need to create a local database called mongodb via mongo shell (in ANOTHER terminal window):
	0. cd ~/
	1. mongo
	2. use mongodb
Lastly, you need to configure "config.js" to have your port number running with your mongo DAEMON from the second step.