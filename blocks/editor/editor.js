var Team1 = Team1 || {}

Team1.Editor = function () {
  _.bindAll(this, "onCursorActivity")

  this.codeEditor = CodeMirror.fromTextArea($("#docEditor")[0],
    {
      lineNumbers: true
      , matchBrackets: true
      , foldGutter: true        //сворачивание кода
      , mode: "javascript"
    })

  this.getThemesList()

  this.changeEditorMode()

  this.getDefaultEditorMode()

  this.codeEditor.on("cursorActivity", this.onCursorActivity)
  this.cursors = []
  this.selections = []
}

Team1.Editor.prototype.onCursorActivity = function () {
  var cursor = this.codeEditor.getCursor()
  var meta = {
    a: "meta"
    , document: {
      id: Team1.documentId
    }
    , id: Team1.__user.id
    , meta: cursor
  }
  Team1.send(JSON.stringify(meta))
}

Team1.Editor.prototype.addCursor = function (cursorInfo) {
  var opt = {className: this.getCursorClass(cursorInfo.id, cursorInfo.color)}
    , to = {
      ch: cursorInfo.position.ch + 1,
      line: cursorInfo.position.line
    }

  var cursor = this.codeEditor.markText(cursorInfo.position, to, opt)
  if (cursor.lines.length)
    this.cursors.push({id: cursorInfo.id, cursor: cursor})
  else
    this.addCursorOnLineEnd(cursorInfo)
}

Team1.Editor.prototype.getCursorClass = function (id, color) {
  return "cm-cursor cm-cursor-" + color + " cursor-id-" + id
}

Team1.Editor.prototype.addCursorOnLineEnd = function (cursorInfo) {
  var opt = {
      className: this.getCursorClassAfter(cursorInfo.id, cursorInfo.color)
    }
    , to = {
      ch: cursorInfo.position.ch - 1,
      line: cursorInfo.position.line
    }

  var cursor = this.codeEditor.markText(to, cursorInfo.position, opt)
  this.cursors.push({id: cursorInfo.id, cursor: cursor})
}

Team1.Editor.prototype.getCursorClassAfter = function (id, color) {
  return "cm-cursor-last cm-cursor-last-" + color + " cursor-id-" + id
}

Team1.Editor.prototype.updateCursor = function (cursorInfo) {
  this.removeCursor(cursorInfo.id)
  this.addCursor(cursorInfo)
}

Team1.Editor.prototype.removeCursor = function (id) {
  for (var i = this.cursors.length - 1; i >= 0; i--) {
    if (this.cursors[i].id === id) {
      this.cursors[i].cursor.clear()
      this.cursors.splice(i, 1)
    }
  }
}

Team1.Editor.prototype.addSelection = function (selectionInfo) {
  var opt = {
    className: this.getSelectionClass(selectionInfo.id, selectionInfo.color)
  }

  var sel = this.codeEditor.markText(selectionInfo.from, selectionInfo.to, opt)
  this.selections.push({id: selectionInfo.id, sel: sel})
}

Team1.Editor.prototype.getSelectionClass = function (id, color) {
  return "cm-background-" + color + " selection-id-" + id
}

Team1.Editor.prototype.updateSelection = function (selectionInfo) {
  this.removeSelection(selectionInfo.id)
  this.addSelection(selectionInfo)
}

Team1.Editor.prototype.removeSelection = function (id) {
  for (var i = this.selections.length - 1; i >= 0; i--) {
    if (this.selections[i].id === id) {
      this.selections[i].sel.clear()
      this.selections.splice(i, 1)
    }
  }
}

Team1.Editor.prototype.getThemesList = function () {
  var self = this

  $.get("/theme", function (data) {
    self.themesList = JSON.parse(data)
  }).done(function () {
    self.setThemesList()
  })
}

Team1.Editor.prototype.setThemesList = function () {
  var $themesList = $(".control__themelist")

  this.themesList.forEach(function (theme) {
    $themesList.append("<option>" + theme.slice(0, -4) + "</option>")
  })

  $("body").append("<style class='theme_style'>")

  this.addHandlerToThemeOption()
}

Team1.Editor.prototype.addHandlerToThemeOption = function () {
  var self = this
    , theme
    , $themesList = $(".control__themelist")

  $themesList.on("change", function () {
    theme = $(this).find("option:selected").text()

    self.setTheme(theme)
  })
}

Team1.Editor.prototype.setTheme = function (theme) {
  var self = this

  $.get("/theme", {name: theme})
    .done(function (data) {
      $(".theme_style").text(JSON.parse(data))
      self.codeEditor.setOption("theme", theme)
    }).fail(function () {
      console.log("Error downloading theme")
    })
}

Team1.Editor.prototype.changeEditorMode = function () {
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

Team1.Editor.prototype.getDefaultEditorMode = function () {
  var editorMode = "light" //light or dark

  this.setDefaultEditorMode(editorMode);
}
Team1.Editor.prototype.setDefaultEditorMode = function (editorMode) {
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
