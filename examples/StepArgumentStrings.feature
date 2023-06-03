Feature: Automatically generate arguments for strings

    Scenario: generate arguments for strings
        Given "John" likes color "Red"
        When "John" buys a "car"
        Then "John" should have a "Red" "car"