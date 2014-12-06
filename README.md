#Gocodewith.me

This project is new version of [WingPad](https://github.com/yandex-shri-minsk-2014/team-1)

Installing:
`npm install`
This run native npm installer. After that run bower install and gulp build.

Launch:
`npm run app`

Developing:
For development you need to start 2 processes. Gulp for build frontend part and nodejs server.
`npm run gulp` - compile project and start watching files
`npm start` - start server with `supervisor`

###Added flexibility in developing and code feature
  - Hard refactoring the application (rewrote on `Express 4`)
  - Hard refactoring `gulpfile.js` (change the structure)
  - Add convenient loggers
  - Add `router`
  - Add [supervisor](http://supervisord.org/) - for development only
  - Add environments (`PRODUCTION`, `DEVELOPMENT`)
  - Add `mongodb` (with `mongoose` ODM)
  - Add node template engine - `Jade`
  - Add css preprocessor - `SCSS`
  - Use models and controllers to organize code (for Users and Rooms)

###New features and improvements
  - Authentication in app
  - Authentication in app via `GitHub`
  - Switch color schemes for users (18 more popular)
  - Selecting programming languages highlight (60 languages)
  - Selecting font
  - Selecting theme (color schema)
  - Selecting font size (12-16px)
  - Saving your editor settings
  - Creating a named room
  - Room stores programming language
  - Save documents in database instead of saving it in file system
  - Deploy on [Heroku](https://www.heroku.com)
  - Add the domain name - [gocodewith.me](https://gocodewith.me)
  - Add the ability to save the syntax in the room


###Todo
  - Save settings of the user for each room
  - Add `vim` and `emacs` keymaps
  - Add caching themes, fonts and syntax highlight files
  - Add the ability
    + to set a password on the room
    + to set user rights (for example, read-only)
    + to configure tab size
  - Remove source files from `public` directory
  - Add files minification (gulp task)
