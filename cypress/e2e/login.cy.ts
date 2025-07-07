describe("Se connecter à un compte", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/#/login");
  });

  it("Devrait afficher la page de connexion", () => {
    cy.get("h3").contains("Login").should("be.visible");
  });

  it("Devrait pouvoir se connecter", () => {
    cy.get('input[name="username"]')
      .type("azeazeaze")
      .should("have.value", "azeazeaze");

    cy.get('input[name="password"]')
      .type("azeazeaze")
      .should("have.value", "azeazeaze");

    cy.get('button[type="submit"]').should("be.enabled").click();

    cy.contains("azeazeaze").should("be.visible");
  });
});
