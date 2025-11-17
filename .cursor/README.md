# Cursor Local Context Storage

This directory contains all workspace context, embeddings, memory, rules, and chat history stored locally within the project.

## Directory Structure

- **config.json** - Main configuration file for local storage mode (local-only, no cloud sync)
- **workspace.json** - Workspace metadata and project information
- **migration-summary.json** - Summary of context regeneration and updates
- **context/** - Project context files and codebase understanding
  - `project-context.md` - Complete project context documentation
  - `context-summary.md` - Brief context summary
- **embeddings/** - Local codebase embeddings for semantic search (ready for generation)
- **memory/** - Project memory, learned patterns, and context
  - `project-memory.json` - Project memory with insights, patterns, and known issues
  - `development-notes.md` - Development notes and considerations
- **rules/** - Project-specific rules and guidelines
  - `project-rules.md` - Project rules and development guidelines
  - `rules.md` - Additional rules file
- **chat/** - Chat history and conversation context
  - `chat-context.json` - Key conversations, decisions, and project state
- **index/** - Local codebase index for fast file lookup
  - `codebase-index.json` - Comprehensive codebase index (regenerated)
  - `project-structure.json` - Project structure reference
  - `codebase-index-legacy.json` - Legacy index (preserved)

## Storage Mode

This workspace is configured for **local-only storage**. All context, embeddings, and memory are stored within this `.cursor` directory and are **NOT synced to cloud storage**.

### Configuration
- **Storage Mode:** Local
- **Cloud Sync:** Disabled
- **Force Local:** Enabled
- **Last Updated:** 2025-01-27

## Context Files

### Codebase Index (`index/codebase-index.json`)
Comprehensive index of all files, their purposes, dependencies, and relationships. Includes:
- Complete file structure
- File descriptions and responsibilities
- Key functions and features
- Business rules and enforcement
- Data storage structure
- External integrations

### Project Context (`context/project-context.md`)
Detailed documentation covering:
- Project overview and architecture
- Data flow and business rules
- File responsibilities
- Technical details and implementation
- Development guidelines
- Security considerations
- Future enhancements

### Project Memory (`memory/project-memory.json`)
Structured memory containing:
- Key insights by category
- Common code patterns
- Known issues and limitations
- Future considerations
- Configuration details
- Important notes

### Chat Context (`chat/chat-context.json`)
Conversation history including:
- Key conversations and topics
- Important decisions and rationale
- Current project state
- Recent changes
- Configuration details

### Project Rules (`rules/project-rules.md`)
Project-specific rules covering:
- Code standards
- Business logic rules
- Development rules
- File organization
- Context storage rules

## Regeneration

All context files were last regenerated on **2025-01-27** from the actual codebase. The regeneration process:
1. Analyzed all project files
2. Updated codebase index with current structure
3. Regenerated project context documentation
4. Updated project memory with latest insights
5. Updated chat context with current state
6. Preserved existing legacy files for reference

## Usage

Cursor will automatically use these local context files for:
- Code understanding and suggestions
- Project-aware autocomplete
- Context-aware chat responses
- Semantic code search (when embeddings are generated)

## Maintenance

To update context files:
1. Regenerate codebase index when file structure changes
2. Update project context when architecture changes
3. Update project memory when new patterns or issues are discovered
4. Update chat context after significant conversations

## Notes

- All context is stored locally - no cloud dependencies
- Context files are version-controlled (can be committed to git)
- Embeddings directory is ready but empty (embeddings can be generated on demand)
- Legacy files are preserved for reference but not actively used
