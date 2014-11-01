var Team1 = Team1 || {}

Team1.Editor = function () {
  _.bindAll(this, "onCursorActivity")

  this.codeEditor = CodeMirror.fromTextArea($("#docEditor")[0])

  this.codeEditor.on("cursorActivity", this.onCursorActivity)
}
Team1.Editor.prototype.onCursorActivity = function (data) {
  console.log(data)
}
