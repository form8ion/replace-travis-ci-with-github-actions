Feature: Package

  Scenario: enabled travis config lint
    Given the travis config lint script is enabled
    When the service is replaced
    Then the travis config lint script is removed
    And the travis config file removed

  Scenario: disabled travis config lint
    Given the travis config lint script is disabled
    When the service is replaced
    Then the travis config lint script is removed
    And the travis config file removed
