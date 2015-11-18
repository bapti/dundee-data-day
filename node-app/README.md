

#### Running node locally

```sh
# get in the directory
cd /node-app

# install webpack globally
npm install -g webpack

# start the app
npm start

# navigate to
http://localhost:3000
```

#### Docker stuff

With a valid docker host set run these commands
```sh
# build our docker container
docker build -t bapti/dundee-data-day .

# run our docker container
docker run -p 3000:3000 -d bapti/dundee-data-day

# Open the url
http://192.168.99.100:3000
http://docker-host:3000
```
