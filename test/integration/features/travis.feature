Feature: travis

  Scenario: enabled travis config lint
    Given the travis config lint script is enabled
    And there is a travis status badge in the README
    When the service is replaced
    Then the travis config is removed
    And the travis status badge is removed
    And the workflow is defined for GitHub Actions

  Scenario: disabled travis config lint
    Given the travis config lint script is disabled
    And there is a travis status badge in the README
    When the service is replaced
    Then the travis config is removed
    And the travis status badge is removed
    And the workflow is defined for GitHub Actions
