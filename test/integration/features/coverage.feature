Feature: coverage

  Scenario: not tested
    Given the project is not tested
    And the project is public
    When the service is replaced
    Then the workflow is defined for GitHub Actions
    But coverage will not be reported

  Scenario: private
    Given the project is unit tested
    And the project is private
    When the service is replaced
    Then the workflow is defined for GitHub Actions
    And coverage will not be reported

  Scenario: unit tested package
    Given the project is published
    And the project is unit tested
    And the project is public
    When the service is replaced
    Then the workflow is defined for GitHub Actions
    And coverage will be reported
