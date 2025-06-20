# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

This marks the first official, stable release of Aideen Audit! This release includes the fully functional calculator logic, a complete JavaScript refactor, style overhaul, and numerous new features.

### Added

-   **Real-World Cost Analysis:** Calculates the estimated total cost of required pulls based on an optimal combination of Oneiric Shard packs.
-   **Global Currency Support:** Added a dynamic region selector to fetch up-to-date pricing and provide cost estimates in a variety of local currencies.
-   **Granular Bonus Toggles:** Implemented individual toggles for each first-time top-up bonus, including a "Toggle All" option for convenience.
-   **Input Validation:** Integrated robust validation to prevent invalid data entry and provide clear user feedback on errors.
-   **Instructional Panel:** Added a helpful guide explaining the pity system and app features, which appears before the first calculation.
-   **Responsive Mobile Layout:** Greatly improved the layout and user experience on mobile devices, including a completely re-formatted results table.
-   **UI Animations:** Added animations for calculation results.
-   **Documentation:** Implemented a `CHANGELOG.md` and `README.md` to document the project.

### Changed

-   **Complete JavaScript Refactor:** Overhauled the entire codebase from a single monolithic script to a modern, modular architecture using ES Modules. These individual modules vastly improve readability, maintainability, and scalability.
-   **Project Name:** Named the project "Aideen Audit".
-   **Pity Calculation:** Refined initial logic for soft (75/150) and hard (90/180) pity thresholds.

### Fixed

-   **Input Logic:** Ensured calculations do not allow for negative resource values.
-   **Cost Calcuations:** Completely overhauled the calculator's logic to be much more accurate and precise. 