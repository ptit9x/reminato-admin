# cocgiay-backend

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

## Docker Staging

```bash
$ docker stop $(docker ps -a -q)
$ docker rm $(docker ps -a -q)
$ docker image rm {image cocgiay_api}
$ docker image rm {image coc_giay_admin}
$ docker-compose -f docker-compose-dev.yml up -d
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
