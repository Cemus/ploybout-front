describe("Se connecter à un compte", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/#/login");
  });

  it("Devrait afficher la page de connexion", () => {
    cy.get("h3").contains("Login").should("be.visible");
  });

  it("Devrait pouvoir se connecter", () => {
    cy.log("Remplissage du username");
    cy.get('input[name="username"]')
      .type("azeazeaze")
      .should("have.value", "azeazeaze");

    cy.log("Remplissage du password");
    cy.get('input[name="password"]')
      .type("azeazeaze")
      .should("have.value", "azeazeaze");

    cy.log("Clic sur le bouton submit");
    cy.get('button[type="submit"]').should("be.enabled").click();

    cy.log("Vérification de l'URL");
    cy.url().should("include", "/profile");

    cy.log("Vérification de la présence du nom d'utilisateur");
    cy.contains("azeazeaze").should("be.visible");
  });
});
