describe("Roster Tests", function () {
  beforeEach(function () {
    this.testData =
    { user:
      { id: 100
      , title: "testTitle"
      , color: "black"
      }
      , usersList:
      [ { id: 101
        , title: "one"
        , color: "black"
        }
        , {
          id: 102
        , title: "two"
        , color: "black"
        }
      ]
    }

    jasmine.getFixtures().fixturesPath="base/blocks/page/"

    loadFixtures("page.html")

    this.testObj = new Team1.Roster()
  })

  it("should provide an ability to add new user", function () {
    this.testObj.add(this.testData.user)

    expect($(".roster-list").find("li")).toHaveText(this.testData.user.title)
    expect($(".roster-list")).toContainElement("#"+ this.testData.user.id +".roster-item")
  })

  it("should provide a way to rebuild a list with new users", function () {
    this.testObj.fillList(this.testData.usersList)

    expect($(".roster-list")).toContainElement($("#"+ this.testData.usersList[0].id))
    expect($(".roster-list")).toContainElement($("#"+ this.testData.usersList[1].id))
  })

  it("should provide a way to delete user via id", function () {
    var testId = 100;

    $(".roster-list").append("<li id='"+testId+"'>test</li>")

    this.testObj.remove(100)

    expect($(".roster-list")).not.toContainElement($("#"+ testId))
  })
})
