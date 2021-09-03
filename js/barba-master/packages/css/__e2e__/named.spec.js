describe('Named transition', () => {
  it('works', () => {
    cy.prepare('/named.html', 'named', 'named');
    // Click link
    cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting
    cy.get('[data-test=link]').click();
    cy.final('/page.html', 'page', 'page');
    cy.get('@next')
      .should('not.have.class', 'named-enter')
      .should('not.have.class', 'named-enter-to')
      .should('not.have.class', 'named-enter-active');
  });
});
