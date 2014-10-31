describe("Page Integration Tests", function () {
  var socketHandlers = {}

  beforeEach(before)

  it("should show promt on init", showPromptTest)
  it("should send socket message on ok click with user's name", sendSocketMessageTest)
  it("should fill user's list on open", onOpenFillUsersListTest)
  it("should remove existing user from list on close", onRemoveExistingUserTest)
  it("should add new user to list on join", onJoinNewUserTest)


  function before () {
    jasmine.getFixtures().fixturesPath = "base/"
    loadFixtures("index.html")

    this.testSocket =
    { on: function (event, handler) {
      socketHandlers[event] = handler
    }
    , emit: function () {}
    }

    window.io =
    { connect: function () {}
    }

    this.promptSpy = spyOn(window, "prompt")

    spyOn(window.io, "connect").and.returnValue(this.testSocket)

    this.usersListEl = $(".roster-list")
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
  function onOpenFillUsersListTest () {
    Team1.start({socketUrl: "/test"})

    socketHandlers['open'].call({}
      , {
        document:
        { users:
          [ {
            id: 1
          , title: "test1"
          }
          , {
            id: 2
          , title: "test1"
          }
          , {
            id: 3
          , title: "test1"
          }
          ]
        }
      }
    )

    expect(this.usersListEl).toContainElement("li#1.roster-item")
    expect(this.usersListEl).toContainElement("li#2.roster-item")
    expect(this.usersListEl).toContainElement("li#3.roster-item")
  }
  function onJoinNewUserTest() {
    Team1.start({socketUrl: "/test"})

    socketHandlers['open'].call({}, {})
    socketHandlers['join'].call({}
      , { user:
          { id: 1
          , title: "test1"
          }
        }
      )

    expect(this.usersListEl).toContainElement("li#1.roster-item")
    expect(this.usersListEl.find(".roster-item").text()).toBe("test1")
  }
  function onRemoveExistingUserTest() {
    socketHandlers['open'].call({}, {})

    this.usersListEl.append("<li id='12'>test</li>")

    socketHandlers['leave'].call({}, {user: {id: 12}})

    expect(this.usersListEl).not.toContainElement("li#12")
  }
})
