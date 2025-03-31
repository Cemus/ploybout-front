import { describe, it, cy } from "cypress";

describe("Visite le serveur dev", () => {
  it("Devrait afficher la page d'accueil", () => {
    cy.visit("http://localhost:5174/");
  });
  it("Devrait afficher les conditions d'utilisation", () => {
    cy.visit("http://localhost:5174/gcu");
  });
});
