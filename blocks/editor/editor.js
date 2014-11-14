var Team1 = Team1 || {}

Team1.Editor = function (info) {
  _.bindAll(this, "onCursorActivity")

  this.cursorHtml = "<div class='CodeMirror-cursor' style='height: 13px; left: 10px;' />"
  this.cursorsContainerEl = $(".CodeMirror-cursors")

  this.codeEditor = CodeMirror.fromTextArea($("#docEditor")[0]
    , { mode: "javascript"
      , lineNumbers: true
      , matchBrackets: true
    }
  )

  this.codeEditor.on("cursorActivity", this.onCursorActivity)
}

Team1.Editor.prototype.onCursorActivity = function () {
  var cursor = this.codeEditor.getCursor()
  var meta =  { a: 'meta'
              , document:
                { id: Team1.documentId
                }
              , id: Team1.__user.id
              , meta:cursor
              }
  Team1.send(JSON.stringify(meta))
}

Team1.Editor.prototype.addCursor = function (cursorInfo) {
  var opt = { className: this.getCursorClass(cursorInfo.id, cursorInfo.color)}
  , to = {
    ch: cursorInfo.position.ch + 1,
    line: cursorInfo.position.line
  }

  this.codeEditor.markText(cursorInfo.position, to, opt)
}

Team1.Editor.prototype.getCursorClass = function (id, color) {
  return "cm-cursor cm-cursor-" + color + " cursor-id-" + id
}

Team1.Editor.prototype.updateCursor = function (cursorInfo) {
  this.removeCursor(cursorInfo.id)
  this.addCursor(cursorInfo)
}

Team1.Editor.prototype.removeCursor = function (id) {
  $(".cursor-id-" + id).contents().unwrap()
}

Team1.Editor.prototype.addSelection = function (selectionInfo) {
  var opt = {
    className: this.getSelectionClass(selectionInfo.id, selectionInfo.color)
  }

  this.codeEditor.markText(selectionInfo.from, selectionInfo.to, opt)
}

Team1.Editor.prototype.getSelectionClass = function (id, color) {
  return "cm-background-" + color + " selection-id-" + id
}

Team1.Editor.prototype.updateSelection = function (selectionInfo) {
  this.removeSelection(selectionInfo.id)
  this.addSelection(selectionInfo)
}

Team1.Editor.prototype.removeSelection = function (id) {
  $(".selection-id-" + id).contents().unwrap()
}
