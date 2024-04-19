describe("주문을 테스트한다", () => {
  it("사용자는 배달/포장 중 원하는 유형을 선택할 수 있다", () => {
    cy.visit("/");
    cy.get("[data-cy=deliveryBtn]").should("be.visible").as("deliveryBtn");
    cy.get("[data-cy=pickupBtn").should("be.visible").as("pickupBtn");

    cy.get("@deliveryBtn").click();
    cy.url().should("include", "/food-type");

  });

  it('사용자는 음식 종류를 선택할 수 있다', () => {
    
    // food-type 페이지로 이동
    cy.visit('/food-type')

    // intercept를 사용한 mocking
    // 실제로 서버에 요청하지 않게 mocking (리액트쿼리로 하는 /restaurant/food-type 요청)
    cy.intercept(
      {
        method: "GET",
        url: "/restaurant/food-type",
      },
      [
        {
          id: 1,
          name: "피자",
          icon: "https://kr.object.ncloudstorage.com/icons/ic-pizza.png",
        },
        {
          id: 2,
          name: "동남아",
          icon: "https://kr.object.ncloudstorage.com/icons/ic-asian.png",
        },
        {
          id: 3,
          name: "햄버거",
          icon: "https://kr.object.ncloudstorage.com/icons/ic-burger.png",
        },
        {
          id: 4,
          name: "디저트",
          icon: "https://kr.object.ncloudstorage.com/icons/ic-cake.png",
        },
        {
          id: 5,
          name: "치킨",
          icon: "https://kr.object.ncloudstorage.com/icons/ic-chicken.png",
        },
        {
          id: 6,
          name: "탕,찌개",
          icon: "https://kr.object.ncloudstorage.com/icons/ic-hotpot.png",
        },
        {
          id: 7,
          name: "고기",
          icon: "https://kr.object.ncloudstorage.com/icons/ic-meat.png",
        },
        {
          id: 8,
          name: "중식",
          icon: "https://kr.object.ncloudstorage.com/icons/ic-noodle.png",
        },
        {
          id: 9,
          name: "샐러드",
          icon: "https://kr.object.ncloudstorage.com/icons/ic-salad.png",
        },
      ]
    );
    // data-cy가 1인 즉, foodType.id가 1인 값 파싱 후 alias
    cy.get('[data-cy=1]').should('be.visible').as('pizzaBtn');
    cy.get('@pizzaBtn').click()
    // 피자 버튼 클릭 후 피자 디테일 페이지로 이동했는지 확인
    cy.url().should("include", "/food-type/1");
  })

  it("사용자는 원하는 레스토랑을 선택할 수 있다", () => {
    cy.visit('/food-type/1')

    cy.intercept(
      {
        method: "GET",
        url: "/restaurant/food-type/1"
      },
      // fixture의 restaurant-list.json을 가져옴
      // 깔끔
      {
        fixture: 'restaurant-list.json'
      }
    )

    // fixture 에 있는 restaurant-list.json 를 읽어와서 그 값을 사용함
    cy.fixture('restaurant-list.json').then((restaurant) => {
      cy.get(`[data-cy=${restaurant[0].id}]`).should('be.visible').as('restaurantBtn')
      cy.get('@restaurantBtn').click()
      cy.url().should('include', '/restaurant/1') 
    })
  })

  it("사용자는 원하는 메뉴를 장바구니에 담고, 원하는 음식 갯수를 변경할 수 있다", () => {
    cy.visit("/restaurant/1");
    cy.intercept(
      {
        method: "GET",
        url: "/restaurant/1",
      },
      {
        fixture: "menu.json",
      }
    );

    cy.fixture("menu.json").then((menu) => {
      cy.get(`[data-cy=${menu.menu_set[0].id}]`)
        .should("be.visible")
        .as("foodBtn");
      cy.get("@foodBtn").click();

      cy.url().should("include", "/order");
      cy.get("[data-cy=counter]").as("counter");
      // input, button 값을 확인할때는 equal을 사용햇는데
      // section은 contain을 사용한다.
      cy.get("@counter").should("contain", 1);
      cy.get("[data-cy=incrementBtn]").should("be.visible").click();
      cy.get("@counter").should("contain", 2);
      cy.get("[data-cy=decrementBtn]").should("be.visible").click();
      cy.get("@counter").should("contain", 1);
      cy.get("[data-cy=completeBtn]").should("be.visible").click();
      cy.url().should("include", "/");
    });
  });
});
