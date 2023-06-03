Feature: Automatically generate arguments for numbers

    Scenario: generate arguments for numbers
        Given there are 9 cucumbers
        When I eat 3 cucumbers
        Then I should have 6 cucumbers