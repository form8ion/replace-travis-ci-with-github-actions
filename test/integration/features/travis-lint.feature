Feature: travis-lint

  Scenario: enabled travis config lint
    Given the travis config lint script is enabled
    When the service is replaced
    Then the travis config is removed
    And the workflow is defined for GitHub Actions

  Scenario: disabled travis config lint
    Given the travis config lint script is disabled
    When the service is replaced
    Then the travis config is removed
    And the workflow is defined for GitHub Actions
