describe("Users Tests", function () {
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

    this.testObj = new App.Users()
  })

  it("should provide an ability to add new user", function () {
    this.testObj.add(this.testData.user)

    expect($(".sidebar__users").find("li")).toHaveText(this.testData.user.title)
    expect($(".sidebar__users")).toContainElement("#"+ this.testData.user.id +".sidebar__users__item")
  })

  it("should provide a way to rebuild a list with new users", function () {
    this.testObj.fillList(this.testData.usersList)

    expect($(".sidebar__users")).toContainElement($("#"+ this.testData.usersList[0].id))
    expect($(".sidebar__users")).toContainElement($("#"+ this.testData.usersList[1].id))
  })

  it("should provide a way to delete user via id", function () {
    var testId = 100;

    $(".sidebar__users").append("<li id='"+testId+"'>test</li>")

    this.testObj.remove(100)

    expect($(".sidebar__users")).not.toContainElement($("#"+ testId))
  })
})
