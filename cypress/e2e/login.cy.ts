describe("Se crée un compte", () => {
  it("Devrait afficher la page de connexion", () => {
    cy.visit("http://localhost:5174/login");
  });
  it("Devrait pouvoir se connecter", () => {
    it("Devrait pouvoir s'inscrire", () => {
      cy.visit("http://localhost:5174/login");

      cy.get('input[name="username"]').type("azeazeaze");
      cy.get('input[name="password"]').type("azeazeaze");

      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/profile");
      cy.contains("azeazeaze").should("be.visible");
    });
  });
});
