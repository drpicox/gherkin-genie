Feature: Support Doc Strings

    Scenario: use docStrings
        Given a blog post named "Random" with Markdown body
            """
            Some Title, Eh?
            ===============
            Here is the first paragraph of my blog post. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
            """
        Then the blog post should be titled "Random"
        And the blog post body should contain "Here is the first paragraph"