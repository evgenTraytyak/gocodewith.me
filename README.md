#WingPad

![David](https://david-dm.org/yandex-shri-minsk-2014/team-1.png)
[![Issue Stats](http://issuestats.com/github/yandex-shri-minsk-2014/team-1/badge/pr)](http://issuestats.com/github/yandex-shri-minsk-2014/team-1)
[![Issue Stats](http://issuestats.com/github/yandex-shri-minsk-2014/team-1/badge/issue)](http://issuestats.com/github/yandex-shri-minsk-2014/team-1)

Collaborative real-time code editor

## Installing and running

Navigate to the app folder and type following commands:

* `npm install`  -- install all dependencies from package.json
* `bower install` -- install all dependencies from bower.json
* `npm run make` -- run gulp
* `node server.js` -- run server

## Dependencies:

Text editor implemented in JavaScript for the browser:

[Codemirror](http://codemirror.net/)

Operational Transform library:

[ShareJS](http://sharejs.org/)

Websocket library:

[Websocket](https://github.com/einaros/ws)

## Project structure:

`blocks/` -- frontend. Client code (html, css, js) should be placed into appropriate blocks

`config/` -- basic app config (currently - port numbers)

`server/` -- backend. Entity descriptions (user, document) and request processing logic (e.g. operational transformation).
