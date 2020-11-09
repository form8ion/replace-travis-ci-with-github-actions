Feature: project-type

  Scenario: package
    Given the project is a package
    When the service is replaced
    Then pushes to prerelease branches will be built

  Scenario: cli
    Given the project is a cli
    When the service is replaced
    Then pushes to prerelease branches will be built

  Scenario: application
    Given the project is an application
    When the service is replaced
    Then pushes to prerelease branches will not be built
