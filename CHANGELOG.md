# Change Log

All notable changes to the "copy-code-block" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.1.1] - 2025-05-27

### Added
- New `${MARKDOWN_HEADING}` token that extracts markdown heading text from lines starting with `#`
- Support for all markdown heading levels (# through ######)
- Automatic heading text extraction with proper whitespace handling
- Graceful handling of non-heading lines (returns empty string)

### Technical
- Robust regex pattern matching for markdown headings
- Integration with existing placeholder system
- Minimal code impact with efficient implementation

## [0.1.0] - 2024-12-19

### Added
- New `${SELECTED_CODE}` token that returns selected text or current line text if no selection
- Enhanced functionality to support copying selected code blocks
- Backward compatibility maintained with existing `${CODE}` token

### Changed
- Updated documentation with new token usage examples
- Added new "selected" format example in README

## [0.0.12] - Previous

- Initial release
