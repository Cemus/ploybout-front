describe("Se connecter à un compte", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/#/login");
  });

  it("Devrait afficher la page de connexion", () => {
    cy.get("h3").contains("Login").should("be.visible");
  });

  it("Devrait pouvoir se connecter", () => {
    cy.get('input[name="username"]').type("azeazeaze");
    cy.get('input[name="password"]').type("azeazeaze");

    cy.intercept("POST", "/api/login").as("loginRequest");

    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

    cy.url().should("include", "/profile");
    cy.contains("azeazeaze").should("be.visible");
  });
});
