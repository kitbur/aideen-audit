# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

-   Integrated an Express.js backend server to serve live banner data from the [HoYoverse API](https://github.com/torikushiii/hoyoverse-api).
-   Implemented backend API proxying to fetch Honkai: Star Rail banner information dynamically.

### Changed

-   Updated project to `"type": "module"` in `package.json` to enable ES modules support.
-   Refactored `api.js` with JSDoc comments.

## [1.1.0] - 2025-06-28

### Added

-   Automated weekly fetching of regional price data using GitHub Actions.
-   Added .prettierignore to prevent formatting issues with configuration files.

### Changed

-   Applied Prettier styling across the codebase for consistent formatting.

### Fixed

-   Corrected version linking URLs in the `CHANGELOG` documentation for better readability.
-   Configured GitHub Actions permissions to allow automated pushes for the price update.

## [1.0.1] - 2025-06-22

### Added

-   Automated testing suite using Vitest to ensure accuracy and prevent regressions.
-   Comprehensive unit tests for all core calculation functions.

### Fixed

-   A bug where calculations could result in negative values under certain inputs.

## [1.0.0] - 2025-06-22

This marks the first official, stable release of Aideen Audit! This release includes the fully functional calculator logic, a complete JavaScript refactor, style overhaul, and numerous new features.

### Added

-   **Real-World Cost Analysis:** Calculates the estimated total cost of required pulls based on an optimal combination of Oneiric Shard packs.
-   **Global Currency Support:** Added a dynamic region selector to fetch up-to-date pricing and provide cost estimates in a variety of local currencies.
-   **Granular Bonus Toggles:** Implemented individual toggles for each first-time top-up bonus, including a "Toggle All" option for convenience.
-   **Input Validation:** Integrated robust validation to prevent invalid data entry and provide clear user feedback on errors.
-   **Instructional Panel:** Added a helpful guide explaining the pity system and app features, which appears before the first calculation.
-   **Responsive Mobile Layout:** Greatly improved the layout and user experience on mobile devices, including a completely re-formatted results table, and a on-demand instructional panel overhaul.
-   **UI Animations:** Added animations for calculation results.
-   **Documentation:** Implemented a `CHANGELOG.md` and `README.md` to document the project.

### Changed

-   **Complete JavaScript Refactor:** Overhauled the entire codebase from a single monolithic script to a modern, modular architecture using ES Modules. These individual modules vastly improve readability, maintainability, and scalability.
-   **Project Name:** Named the project "Aideen Audit".
-   **Pity Calculation:** Refined initial logic for soft (75/150) and hard (90/180) pity thresholds.

### Fixed

-   **Input Logic:** Ensured calculations do not allow for negative resource values.
-   **Cost Calcuations:** Completely overhauled the calculator's logic to be much more accurate and precise.

[Unreleased]: https://github.com/kitbur/aideen-audit/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/kitbur/aideen-audit/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/kitbur/aideen-audit/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/kitbur/aideen-audit/releases/tag/v1.0.0
