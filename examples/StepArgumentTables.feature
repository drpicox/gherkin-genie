Feature: Support Tables

    Scenario: use tables in steps
        Given the following users exist:
            | name   | email              | twitter         |
            | Aslak  | aslak@cucumber.io  | @aslak_hellesoy |
            | Julien | julien@cucumber.io | @jbpros         |
            | Matt   | matt@cucumber.io   | @mattwynne      |
        Then the user "Aslak" should have the twitter handle "@aslak_hellesoy"
        And the user "Julien" should have the twitter handle "@jbpros"
        And the user "Matt" should have the twitter handle "@mattwynne"