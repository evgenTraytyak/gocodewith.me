var Team1 = Team1 || {}

Team1.Editor = function () {
  _.bindAll(this, "onCursorActivity")

  this.cursorHtml = "<div class='CodeMirror-cursor cm_cursor'/>"
  this.cursorsContainerEl = $(".CodeMirror-cursors")

  this.codeEditor = CodeMirror.fromTextArea($("#docEditor")[0],
    { lineNumbers: true
    , matchBrackets: true
    , foldGutter: true        //сворачивание кода
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

  this.getThemesList()

  this.changeEditorMode()

  this.getDefaultEditorMode()
}

Team1.Editor.prototype =

  { onCursorActivity: function (data) {
    console.log(data)
  }

  , addCursors: function (usersInfo) {
    var self = this

    _.each(usersInfo, function (userInfo) {
      self.addCursor(userInfo)
    })
  }

  , addCursor: function (userInfo) {
    this.cursorsContainerEl.after(this.getCursorEl(userInfo))
  }

  , getCursorEl: function (userInfo) {
    return $(this.cursorHtml).css({
      borderLeftColor: userInfo.color
      , left: this.getLeftCursorPosition(userInfo.position.ch)
      , top: this.getTopCursorPosition(userInfo.position.line)
    }).prop("id", userInfo.id)
  }

  , getTopCursorPosition: function (line) {
    return Math.round(this.codeEditor.defaultTextHeight() * line)
  }


  , getLeftCursorPosition: function (ch) {
    var DEFAULT_LEFT_MARGIN = 3
    return Math.round(this.getDefaultCharWidth() * ch) + DEFAULT_LEFT_MARGIN
  }

  , getDefaultCharWidth: function () {
    return this.codeEditor.defaultCharWidth()
  }

  , getThemesList: function () {
    var self = this

    $.get( "/theme", function (data) {
      self.themesList = JSON.parse(data)
    }).done(function () {
      self.setThemesList()
    })
  }

  , setThemesList: function () {
    var $themesList = $(".control__themelist")

    this.themesList.forEach(function (theme) {
      $themesList.append("<option>" + theme.slice(0, -4) + "</option>")
    })

    $("body").append("<style class='theme_style'>")

    this.addHandlerToThemeOption()
  }

  , addHandlerToThemeOption: function () {
    var self = this
      , theme
      , $themesList = $(".control__themelist")

    $themesList.on("change", function () {
      theme = $(this).find("option:selected").text()

      self.setTheme(theme)
    })
  }

  , setTheme: function (theme) {
    var self = this

    $.get( "/theme", { name: theme })
      .done(function (data) {
      $(".theme_style").text(JSON.parse(data))
      self.codeEditor.setOption("theme", theme)
    }).fail(function () {
      console.log( "Error downloading theme" )
    })
  }

  , changeEditorMode: function () {
    var $header = $(".header")
      , $roster = $(".roster")

    $(".js-editor-mode-switch").on("change", function () {
      if ($(this).is(":checked")) {
        $header.removeClass("header--dark").addClass("header--light")
        $roster.removeClass("roster--dark").addClass("roster--light")
      } else {
        $header.removeClass("header--light").addClass("header--dark")
        $roster.removeClass("roster--light").addClass("roster--dark")
      }
    })
  }

  , getDefaultEditorMode: function () {
    var editorMode = "light" //light or dark

    this.setDefaultEditorMode(editorMode);
  }

  , setDefaultEditorMode: function (editorMode) {
    var $header = $(".header")
      , $roster = $(".roster")
      , $switchMode = $(".js-editor-mode-switch")

    $header.addClass("header--" + editorMode)
    $roster.addClass("roster--" + editorMode)

    if (editorMode == "light") {
      // $switchMode.prop("checked", true) // don't work
      $switchMode.click();
    }
  }

}

//updateCursors
//removeCursor
//addSelection
//removeSelection
