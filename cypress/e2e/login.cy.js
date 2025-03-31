import { describe, it, cy } from "cypress";

describe("Se crée un compte", () => {
  it("Devrait afficher la page de connexion", () => {
    cy.visit("http://localhost:5173/login");
  });
});
