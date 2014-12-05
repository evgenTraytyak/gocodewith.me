var App = App || {}

App.Editor = function () {
  var self = this

  _.bindAll(self, 'onCursorActivity')

  self.codeEditor = CodeMirror.fromTextArea($('#docEditor')[0],
    { lineNumbers: true
    , matchBrackets: true
    , foldGutter: true
    , tabSize: 4
    })

  self.codeEditor.on('cursorActivity', self.onCursorActivity)
  self.cursors = []
  self.selections = []

  self.addHandlers()

  self.getDefaultUserSettings()
  self.getDefaultRoomSettings()
}

var EditorProto = App.Editor.prototype = {}

EditorProto.addHandlers = function () {
  var $document = $(document)
    , self = this

  $document.on('change', '.js-editor-change-syntax', function () {
    var syntaxName = $(this).val()
      , syntaxMode = $(this).find('option:selected').data('syntax-mode')

    self.Syntax.set(syntaxName, syntaxMode)
    self.Syntax.save(syntaxName, syntaxMode)
  })

  $document.on('change', '.js-editor-change-font', function () {
    var fontName = $(this).val()

    self.Font.set(fontName)
    self.Font.save(fontName)
  })

  $document.on('change', '.js-editor-change-theme', function () {
    var themeName = $(this).val()

    self.Theme.set(themeName)
    self.Theme.save(themeName)
  })

  $document.on('change', '.js-editor-change-font-size', function () {
    var fontSize = $(this).val()

    self.FontSize.set(fontSize)
    self.FontSize.save(fontSize)
  })
}

EditorProto.onCursorActivity = function () {
  var cursor = this.codeEditor.getCursor()
    , meta =
            { a: 'meta'
            , document: { id: App.documentName }
            , id: App.__user.id
            , color: App.__user.color
            , meta: cursor
            }


  App.send(JSON.stringify(meta))
}

EditorProto.addCursor = function (cursorInfo) {
  var opt = {className: this.getCursorClass(cursorInfo.id, cursorInfo.color)}
    , to =
          { ch: cursorInfo.position.ch + 1
          , line: cursorInfo.position.line
          }
    , cursor = this.codeEditor.markText(cursorInfo.position, to, opt)

  if (cursor.lines.length) {
    this.cursors.push({id: cursorInfo.id, cursor: cursor})
  }
  else {
    this.addCursorOnLineEnd(cursorInfo)
  }
}

EditorProto.getCursorClass = function (id, color) {
  return 'cm-cursor cm-cursor-' + color + ' cursor-id-' + id
}

EditorProto.addCursorOnLineEnd = function (cursorInfo) {
  var opt =
            { className: this.getCursorClassAfter(cursorInfo.id, cursorInfo.color)
            }
    , to =
            { ch: cursorInfo.position.ch - 1
            , line: cursorInfo.position.line
            }
    , cursor = this.codeEditor.markText(to, cursorInfo.position, opt)

  this.cursors.push({id: cursorInfo.id, cursor: cursor})
}

EditorProto.getCursorClassAfter = function (id, color) {
  return 'cm-cursor-last cm-cursor-last-' + color + ' cursor-id-' + id
}

EditorProto.updateCursor = function (cursorInfo) {
  this.removeCursor(cursorInfo.id)
  this.addCursor(cursorInfo)
  $('.cursor-id-' + cursorInfo.id + '').css('border-color', cursorInfo.color)
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
  var opt =
            { className: this.getSelectionClass(selectionInfo.id, selectionInfo.color)
            }
    , sel = this.codeEditor.markText(selectionInfo.from, selectionInfo.to, opt)

  this.selections.push({id: selectionInfo.id, sel: sel})
}

EditorProto.getSelectionClass = function (id, color) {
  return 'cm-background-' + color + ' selection-id-' + id
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


// EditorProto.changeEditorMode = function () {
//   var $header = $('.header")
//     , $sidebar = $(".sidebar")

//   $(".js-editor-mode-switch").on("change", function () {
//     if ($(this).is(":checked")) {
//       $header.removeClass("header--dark").addClass("header--light")
//       $sidebar.removeClass("sidebar--dark").addClass("sidebar--light")
//     } else {
//       $header.removeClass("header--light").addClass("header--dark")
//       $sidebar.removeClass("sidebar--light").addClass("sidebar--dark")
//     }
//   })
// }

// EditorProto.getDefaultEditorMode = function () {
//   var editorMode = "dark" //light or dark

//   this.setDefaultEditorMode(editorMode);
// }

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

EditorProto.getDefaultUserSettings = function () {
  var self = this

  $.get('/settings/user')
    .success(function (settings) {
      self.Font.set(settings.font)
      self.Theme.set(settings.theme)
      self.FontSize.set(settings.fontSize)
    })
}

EditorProto.getDefaultRoomSettings = function () {
  var self = this
    , roomName = App.documentName

  $.get('/settings/room', { name: roomName })
    .success(function (settings) {
      self.Syntax.set(settings.syntax.name, settings.syntax.mode)
    })
    .fail(function () {
      console.log('Error getting room settings')
    })
}

EditorProto.Font = {
  set: function (fontName) {
    this.get(fontName)
  },

  get: function (fontName) {
    var self = this

    $.get('/font', { name: fontName })
      .success(function (fontURL) {
        self.init(fontURL, fontName)
      })
      .fail(function () {
        console.log("Error downloading font")
      })
  },

  init: function (fontURL, fontName) {
    var code = "\n@font-face {\n" +
    "font-family: '" + fontName + "';\n" +
    "src: url(" + fontURL + ");\n}"

    $(".js-current-font").html(code)

    $('.CodeMirror').css({'font-family': fontName})
  },

  save: function (fontName) {
    $.post('/settings/user/font', { name: fontName })
  }
}

EditorProto.FontSize = {
  set: function (fontSize) {
    $('.CodeMirror').css(
      { 'font-size': fontSize
      , 'line-height': '1.3'
      }
    )
    this.init()
  },

  init: function () {
    App.Editor.codeEditor.refresh()
  },

  save: function (fontSize) {
    $.post('/settings/user/font-size', { size: fontSize })
  }
}

EditorProto.Theme = {
  set: function (themeName) {
    var self = this

    this.get(themeName, function (themeCode) {
      self.render(themeName, themeCode)
    })
  },

  get: function (themeName, callback) {
    $.get('/theme', { name: themeName })
      .success(callback)
      .fail(function () {
        console.log('Error downloading theme')
      })
  },

  render: function (themeName, themeCode) {
    $('.js-current-theme').text(themeCode)
    this.init(themeName)
  },

  init: function (themeName) {
    App.Editor.codeEditor.setOption('theme', themeName)
  },

  save: function (themeName) {
    $.post('/settings/user/theme', { name: themeName })
  }
}

EditorProto.Syntax = {
  set: function (syntaxName, syntaxMode) {
    this.get(syntaxMode)
  },

  get: function (syntaxMode) {
    var self = this

    $.getScript( '/language/?name=' + syntaxMode
                , function () { self.init(syntaxMode) }
                )
  },

  init: function (syntaxMode) {
    App.Editor.codeEditor.setOption('mode', syntaxMode)
  },

  save: function (syntaxName, syntaxMode) {
    $.post( '/settings/room/syntax'
          , { name: App.documentName
            , syntaxName: syntaxName
            , syntaxMode: syntaxMode
            }
          )
  }
}
