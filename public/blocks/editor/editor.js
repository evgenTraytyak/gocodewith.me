var App = App || {}

App.Editor = function () {
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

  this.setFontSize()

  this.codeEditor.on("cursorActivity", this.onCursorActivity)
  this.cursors = []
  this.selections = []

}

var EditorProto = App.Editor.prototype = {}

EditorProto.onCursorActivity = function () {
  var cursor = this.codeEditor.getCursor()
  var meta = {
    a: "meta"
    , document: {
      id: App.documentId
    }
    , id: App.__user.id
    , color: App.__user.color
    , meta: cursor
  }
  App.send(JSON.stringify(meta))
}

EditorProto.addCursor = function (cursorInfo) {
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

EditorProto.getCursorClass = function (id, color) {
  return "cm-cursor cm-cursor-" + color + " cursor-id-" + id
}

EditorProto.addCursorOnLineEnd = function (cursorInfo) {
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

EditorProto.getCursorClassAfter = function (id, color) {
  return "cm-cursor-last cm-cursor-last-" + color + " cursor-id-" + id
}

EditorProto.updateCursor = function (cursorInfo) {
  this.removeCursor(cursorInfo.id)
  this.addCursor(cursorInfo)
  $(".cursor-id-"+cursorInfo.id+"").css("border-color",cursorInfo.color)
}

EditorProto.removeCursor = function (id) {
  for (var i = this.cursors.length - 1; i >= 0; i--) {
    if (this.cursors[i].id === id) {
      this.cursors[i].cursor.clear()
      this.cursors.splice(i, 1)
    }
  }
}

EditorProto.addSelection = function (selectionInfo) {
  var opt = {
    className: this.getSelectionClass(selectionInfo.id, selectionInfo.color)
  }

  var sel = this.codeEditor.markText(selectionInfo.from, selectionInfo.to, opt)
  this.selections.push({id: selectionInfo.id, sel: sel})
}

EditorProto.getSelectionClass = function (id, color) {
  return "cm-background-" + color + " selection-id-" + id
}

EditorProto.updateSelection = function (selectionInfo) {
  this.removeSelection(selectionInfo.id)
  this.addSelection(selectionInfo)
}

EditorProto.removeSelection = function (id) {
  for (var i = this.selections.length - 1; i >= 0; i--) {
    if (this.selections[i].id === id) {
      this.selections[i].sel.clear()
      this.selections.splice(i, 1)
    }
  }
}

EditorProto.getThemesList = function () {
  var self = this

  $.get("/themes", function (data) {
    self.themesList = JSON.parse(data)
  }).success(function () {
    self.setThemesList()
  })
}

EditorProto.setThemesList = function () {
  var $themesList = $(".control__theme-list")
    , themesList = this.themesList

  for (var name in themesList) {
    $themesList.append("<option value='" + themesList[name].url   + "'>" + name + "</option>")
  }

  $("body").append("<style class='theme_style'>")

  this.addHandlerToThemeOption()
}

EditorProto.addHandlerToThemeOption = function () {
  var self = this
    , theme
    , $themesList = $(".control__theme-list")

  $themesList.on("change", function () {
    theme = $(this).find("option:selected").val()
    self.setTheme(theme)
  })
}

EditorProto.setTheme = function (theme) {
  var self = this

  $.get("/theme", { name: theme })
    .success(function (data) {
      $(".theme_style").text(data)
      self.codeEditor.setOption("theme", theme.slice(0, -4))
    }).fail(function () {
      console.log("Error downloading theme")
    })
}

EditorProto.changeEditorMode = function () {
  var $header = $(".header")
    , $sidebar = $(".sidebar")

  $(".js-editor-mode-switch").on("change", function () {
    if ($(this).is(":checked")) {
      $header.removeClass("header--dark").addClass("header--light")
      $sidebar.removeClass("sidebar--dark").addClass("sidebar--light")
    } else {
      $header.removeClass("header--light").addClass("header--dark")
      $sidebar.removeClass("sidebar--light").addClass("sidebar--dark")
    }
  })
}

EditorProto.getDefaultEditorMode = function () {
  var editorMode = "dark" //light or dark

  this.setDefaultEditorMode(editorMode);
}

EditorProto.setDefaultEditorMode = function (editorMode) {
  var $header = $(".header")
    , $sidebar = $(".sidebar")
    , $switchMode = $(".js-editor-mode-switch")

  $header.addClass("header--" + editorMode)
  $sidebar.addClass("sidebar--" + editorMode)

  if (editorMode == "light") {
    // $switchMode.prop("checked", true) // don't work
    $switchMode.click();
  }
}

EditorProto.setFontSize = function () {
  $(".js-font-size").on("change", function () {
    $(".CodeMirror").css("font-size", $(this).val())
  })
}
