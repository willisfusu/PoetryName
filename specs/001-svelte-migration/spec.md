# Feature Specification: Svelte Migration

**Feature Branch**: `001-svelte-migration`
**Created**: 2026-02-08
**Status**: Draft
**Input**: User description: "transfer current project to a svelte project."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Generate Names from Classical Poetry (Priority: P1)

A user visits the application to generate meaningful Chinese names derived from classical poetry. They see a selection of poetry collections, enter their family name, and click a button to generate names. The system displays multiple name suggestions, each with the source poem line, highlighted characters, poem title, dynasty, and author.

**Why this priority**: This is the core functionality of the entire application. Without name generation, the app has no purpose. All other features depend on this working correctly.

**Independent Test**: Can be fully tested by loading the app, selecting a poetry collection, entering a family name, clicking generate, and verifying that 6 name cards appear with correct name, highlighted source text, and metadata.

**Acceptance Scenarios**:

1. **Given** the app is loaded with the default poetry collection (诗经) pre-selected, **When** the user clicks the generate button, **Then** 6 name cards are displayed, each showing a two-character given name combined with the default family name (李), the source sentence with the two characters highlighted, and the poem title, dynasty, and author.
2. **Given** the app is loaded, **When** the user enters a custom family name and clicks generate, **Then** all 6 name cards display the custom family name combined with the generated given names.
3. **Given** the app is loaded, **When** the user clicks generate multiple times, **Then** new names are generated each time, drawing randomly from the selected poetry collection.

---

### User Story 2 - Switch Between Poetry Collections (Priority: P2)

A user wants to explore names from different classical Chinese poetry traditions. They select a different poetry collection from the available options, wait for it to load, and then generate names from that collection.

**Why this priority**: Offering multiple poetry sources is a key differentiator of this app and provides variety and cultural depth. However, the app is still usable with a single default collection.

**Independent Test**: Can be tested by selecting each of the 7 poetry collections in turn, verifying the loading indicator appears and disappears, and then generating names to confirm they come from the selected collection.

**Acceptance Scenarios**:

1. **Given** the app is loaded with 诗经 selected, **When** the user selects 楚辞, **Then** a loading indicator appears while the data loads, disappears when loading completes, and subsequent name generation draws from 楚辞.
2. **Given** a poetry collection is loading, **When** the loading completes, **Then** the loading indicator is hidden and the generate button becomes functional for the newly loaded collection.
3. **Given** any of the 7 poetry collections is selected, **When** the user generates names, **Then** the source metadata on each name card correctly reflects the selected collection.

---

### User Story 3 - Responsive Experience Across Devices (Priority: P3)

A user accesses the application from a mobile phone, tablet, or desktop browser. The layout adapts to the screen size, with name cards displayed in a multi-column grid on larger screens and a single column on smaller screens. All interactive elements remain usable at any screen size.

**Why this priority**: Mobile accessibility broadens the user base, but the core functionality works regardless of layout. This is an experience enhancement.

**Independent Test**: Can be tested by loading the app at various viewport widths and verifying that the layout adapts, radio buttons and input fields remain usable, and name cards are readable.

**Acceptance Scenarios**:

1. **Given** the app is viewed on a desktop browser (width > 768px), **When** names are generated, **Then** name cards are displayed in a multi-column layout.
2. **Given** the app is viewed on a mobile device (width ≤ 768px), **When** names are generated, **Then** name cards are displayed in a single-column layout with all text readable and buttons tappable.

---

### Edge Cases

- What happens when the poetry data file fails to load (network error or missing file)?
- What happens when the user leaves the family name field empty?
- What happens when a poem's content, after filtering inauspicious characters and punctuation, has fewer than 2 usable characters?
- What happens when the user rapidly switches between poetry collections before the previous one finishes loading?
- What happens when the user enters a multi-character family name?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST generate 6 name suggestions per generation request, each consisting of a user-provided family name combined with two characters extracted from a randomly selected poem in the active collection.
- **FR-002**: System MUST preserve the original poem order of the two selected characters (first character's position ≤ second character's position in the source sentence).
- **FR-003**: System MUST filter out culturally inauspicious characters from the character selection pool before generating names (maintaining the existing exclusion list).
- **FR-004**: System MUST strip all punctuation from poem content before character extraction.
- **FR-005**: System MUST display each generated name with its source context: the original sentence with the two selected characters visually highlighted, the poem title, dynasty, and author.
- **FR-006**: System MUST support 7 poetry collections: 诗经, 楚辞, 唐诗, 宋词, 乐府诗集, 古诗三百首, 著名辞赋.
- **FR-007**: System MUST load 诗经 as the default poetry collection on initial page load.
- **FR-008**: System MUST pre-fill the family name field with 李 as the default value.
- **FR-009**: System MUST show a loading indicator when a poetry collection is being loaded.
- **FR-010**: System MUST allow the user to switch between poetry collections and generate names from the newly selected collection.
- **FR-011**: System MUST function as a client-side single-page application with no server-side processing required for name generation.
- **FR-012**: System MUST replicate all existing visual design elements, including the teal/green color scheme, card-based name display, custom radio buttons, and responsive layout.
- **FR-013**: System MUST use the existing poetry JSON data files without modification to their structure or content.

### Key Entities

- **Poetry Collection**: A named corpus of classical Chinese poetry (e.g., 诗经, 唐诗). Contains multiple poem entries. Identified by a short key (e.g., "shijing") and a display name (e.g., "诗经").
- **Poem Entry**: A single poem or passage within a collection. Has attributes: author, dynasty, content (with HTML markup), book name, and title.
- **Generated Name**: A result combining a family name with two characters from a poem. Associated with the source sentence, highlighted character positions, and poem metadata (title, dynasty, author, book).
- **Inauspicious Character List**: A curated set of Chinese characters excluded from name generation for cultural reasons.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All 7 poetry collections are selectable and produce valid name results, matching the behavior of the current application.
- **SC-002**: Users can generate names within 1 second of clicking the generate button (after the poetry data has loaded).
- **SC-003**: The application renders correctly and is fully functional on screen widths from 320px to 1920px.
- **SC-004**: The application produces a successful production build with no errors.
- **SC-005**: The migrated application is visually indistinguishable from the current application in terms of layout, colors, typography, and user interaction flow.
- **SC-006**: The application loads and becomes interactive within 3 seconds on a standard broadband connection.
- **SC-007**: All name generation logic (random selection, character filtering, order preservation) produces equivalent results to the current implementation.

## Assumptions

- The migration targets Svelte (latest stable version) as the UI framework, replacing jQuery and the manual DOM manipulation approach.
- The existing poetry JSON data files will be reused as-is without structural changes.
- The existing visual design (colors, layout, typography, responsive breakpoints) will be preserved faithfully.
- The build tooling will be modernized as part of the migration (Webpack 3 replaced with Svelte's standard build tooling).
- No new features are being added — this is a 1:1 functional migration to a modern framework.
- The application remains a client-side SPA with no backend requirements.
- The `dist/` directory deployment model may change to align with Svelte's build output conventions.
