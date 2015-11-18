

#### Docker stuff

With a valid docker host set run these commands

```sh

# build our docker container
docker build -t bapti/dundee-data-day .

# run our docker container
docker run -p 49160:3000 -d bapti/dundee-data-day

# Open the url
http://192.168.99.100:49160
http://docker-host:49160

```
