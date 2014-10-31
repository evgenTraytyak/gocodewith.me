describe("Page Integration Tests", function () {
  var socketHandlers = []

  beforeEach(before)
  afterEach(after)

  it("should show promt on init", showPromptTest)
  it("should send socket message on ok click with user's name", sendSocketMessageTest)
  it("should fillUsers list on open")
  it("should remove existing user from list")


  function before () {
    this.mocked = {};

    jasmine.getFixtures().fixturesPath = "base/"

    loadFixtures("index.html")

    //this.mocked.prompt = window.prompt
    //window.prompt = function () {}

    this.testSocket =
    { on: function (event, handler) {
      socketHandlers.push({event: handler})
    }
    , emit: function () {}
    }

    window.io =
    { connect: function () {}
    }

    this.promptSpy = spyOn(window, "prompt")

    spyOn(window.io, "connect").and.returnValue(this.testSocket)
  }

  function after() {
    window.prompt = this.mocked.prompt;
  }

  function showPromptTest() {
    Team1.start({socketUrl: "/testUrl"})

    expect(window.prompt).toHaveBeenCalledWith("Your name:")
  }
  function sendSocketMessageTest () {
    var testTitle = "test dima"
    spyOn(this.testSocket, "emit")

    this.promptSpy.and.returnValue(testTitle)

    Team1.start({socketUrl: "/testUrl"})

    expect(this.testSocket.emit).toHaveBeenCalledWith('open',
      { user:
        { title: testTitle
        }
        , document:
        { id: null
        }
      }
    )
  }
})
