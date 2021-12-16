[![Build Status](https://travis-ci.com/HorizenOfficial/myzenwallet.svg?branch=master)](https://travis-ci.com/HorizenOfficial/myzenwallet) [![GitHub release (latest by date)](https://img.shields.io/github/v/release/HorizenOfficial/myzenwallet)](https://github.com/HorizenOfficial/myzenwallet/releases/latest) [![GitHub All Releases](https://img.shields.io/github/downloads/zencashofficial/myzenwallet/total)](https://github.com/HorizenOfficial/myzenwallet/releases/latest)
# myzenwallet

MyZENWallet is a client-side browser-based wallet for Zen.

### Running locally
Download the latest release tarball [here](https://github.com/HorizenOfficial/myzenwallet/releases/latest), extract it, goto the `dist` folder and double click `index.html`

Alternative: If you have node.js installed it may be used to run a local web server. Extract as above, goto the `dist` folder, open a command window and run `node localserver`. Open a browser window to `localhost:8080`

### Dev
```shell
npm ci
npm run watch # watch and regenerate files
npm run start # start local host server
npm run build # generate ./dist
```
