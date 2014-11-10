var Team1 = Team1 || {}

Team1.Editor = function () {
  _.bindAll(this, "onCursorActivity")

  this.cursorHtml = "<div class='CodeMirror-cursor cm_cursor'/>"
  this.cursorsContainerEl = $(".CodeMirror-cursors")

  this.codeEditor = CodeMirror.fromTextArea($("#docEditor")[0],
    { lineNumbers: true
    , matchBrackets: true
    , mode: "javascript"
  })

  this.addCursors(
    [
      { id: 1
      , color: "red"
      , position:
        { line: 1
        , ch: 2
        }
      }
      , {
        id: 2
      , color: "yellow"
      , position:
        { line: 2
        , ch: 5
        }
      }
    ])

  this.codeEditor.on("cursorActivity", this.onCursorActivity)

  this.getThemesList();
}

Team1.Editor.prototype.onCursorActivity = function (data) {
  console.log(data)
}

Team1.Editor.prototype.addCursors = function (usersInfo) {
  var self = this

  _.each(usersInfo, function (userInfo) {
    self.addCursor(userInfo)
  })
}

Team1.Editor.prototype.addCursor = function (userInfo) {
  this.cursorsContainerEl.after(this.getCursorEl(userInfo))
}

Team1.Editor.prototype.getCursorEl = function (userInfo) {
  return $(this.cursorHtml).css({
    borderLeftColor: userInfo.color
    , left: this.getLeftCursorPosition(userInfo.position.ch)
    , top: this.getTopCursorPosition(userInfo.position.line)
  }).prop("id", userInfo.id)
}

Team1.Editor.prototype.getTopCursorPosition = function (line) {
  return Math.round(this.codeEditor.defaultTextHeight() * line)
}


Team1.Editor.prototype.getLeftCursorPosition = function (ch) {
  return Math.round(this.getDefaultCharWidth() * ch) + this.DEFAULT_LEFT_MARGIN
}

Team1.Editor.prototype.getDefaultCharWidth = function () {
  return this.codeEditor.defaultCharWidth();
}


Team1.Editor.prototype.DEFAULT_LEFT_MARGIN = 3

Team1.Editor.prototype.getThemesList = function () {
  var self = this

  $.get( "/theme", function (data) {
    self.themesList = JSON.parse(data)
    console.log(self.themesList);
  }).done(function () {
    self.setThemesList()
  })
}

Team1.Editor.prototype.setThemesList = function () {
  var $themesList = $(".themelist")

  this.themesList.forEach(function (theme) {
    $themesList.append("<option>" + theme.slice(0, -4) + "</option>")
  })

  $("body").append("<style class='theme_style'>")

  this.addHandlerToThemeOption();
}

Team1.Editor.prototype.addHandlerToThemeOption = function () {
  var self = this
    , theme
    , $themesList = $(".themelist")

  $themesList.on("change", function () {
    theme = $(this).find("option:selected").text()

    self.setTheme(theme);
  })
}

Team1.Editor.prototype.setTheme = function (theme) {
  var self = this

  $.get( "/theme", { name: theme })
    .done(function (data) {
    $(".theme_style").text(JSON.parse(data))
    self.codeEditor.setOption("theme", theme)
  }).fail(function () {
    console.log( "Error downloading theme" )
  })
}

//updateCursors
//removeCursor
//addSelection
//removeSelection
