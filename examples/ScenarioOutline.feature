Feature: Magic of Disappearing Cucumbers

    Scenario: Eating 5 out of 12 cucumbers
        Given there are <start> cucumbers
        When I eat <eat> cucumbers
        Then I should have <left> cucumbers

        Examples:
            | start | eat | left |
            | 12    | 5   | 7    |
            | 20    | 5   | 15   |



