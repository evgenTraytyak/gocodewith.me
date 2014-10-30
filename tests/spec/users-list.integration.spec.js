describe("Page Integration Tests", function () {
  beforeEach(before)

  it("should show promt on init", showPromptTest)
  it("should send socket message on ok click with user's name")
  it("should fillUsers list on opn")
  it("should remove existing user from list")

  function before () {
    this.testSocket =
    { on: function () {}
    , emit: function () {}
    };

    window.io = {
      connect: function () {}
    }

    spyOn(window, "prompt")
    spyOn(window.io, "connect").and.returnValue(this.testSocket)
  }

  function showPromptTest() {
    Team1.start({socketUrl: "/testUrl"})

    expect(window.prompt).toHaveBeenCalledWith("Your name:")
  }
})
