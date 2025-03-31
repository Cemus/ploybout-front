describe("Se créer un compte", () => {
  it("Devrait afficher la page d'inscription", () => {
    cy.visit("http://localhost:5173/register");
  });
});
