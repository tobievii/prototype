
var testacc = {
    email: "testaccount@test.com",
    password: "testASDF1234!@#$"
}



describe('Prototyp3 basic tests', function () {

    it('User registration', function () {
        //expect(true).to.equal(true)
        cy.visit('http://localhost:8080')
        //cy.get('.menuTab').click()

        cy.get('.register').click()
        cy.get('[style=""] > [style="margin-top: 2px; margin-bottom: 5px;"] > .col-9 > #emailInput').type("helllo!");
        // cy.get('[style=""] > [style="margin-top: 2px; margin-bottom: 5px;"] > .col-9 > input').type(testacc.email);
        // cy.get('[style="margin-bottom: 15px;"] > .col-9 > input').type(testacc.password);
        // cy.get('.col-5 > .btn-spot').click()
    })

    // it("User should login", function () {
    //     cy.visit('http://localhost:8080')
    //     cy.get('.col-md-12 > :nth-child(2)').click();
    //     cy.get('[style=""] > [style="margin-top: 2px; margin-bottom: 5px;"] > .col-9 > input').type(testacc.email);
    //     cy.get('[style="margin-bottom: 15px;"] > .col-9 > input').type(testacc.password);
    //     cy.get('.loginB > .btn-spot').click();
    // })

})

