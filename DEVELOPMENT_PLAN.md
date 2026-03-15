# Nano Coloring Book — Full E-Commerce App Development Plan

## Status: IN DEVELOPMENT
All tests pending. Subagents spawned to audit, build, test, and iterate until 100% functionality verified.

## Critical Missing Features

### 1. Interactive Coloring Canvas ⚠️
- **Current**: Just views images, no painting capability
- **Needed**: Full canvas with touch-based drawing
- **Tools**: React Native Skia or react-native-canvas
- **Features**:
  - Brush with adjustable size
  - Color picker (palette + custom)
  - Eraser
  - Undo/Redo
  - Save drawn state to AsyncStorage

### 2. Color Variant Pre-Generation 🔴 CRITICAL
- **Current**: No variants generated
- **Needed**: During book creation, generate 5+ color palettes for EACH page
  - Example palettes: Pastel, Vibrant, Ocean, Sunset, Forest, Rainbow
  - Generate all at creation time (parallel, not sequential)
  - Store as `images[pageIdx].variants[paletteIdx]`
- **Benefit**: Instant switching on coloring screen (no regeneration delay)

### 3. Persistent Book Storage
- **Current**: Books not saved between sessions
- **Needed**: AsyncStorage with full CRUD
  - Save created books: title, pages, color variants, drawing state
  - Load books on "My Books" screen
  - Resume coloring mid-session

### 4. Image Generation API
- **Current**: Using Gemini API (may not be returning images)
- **Needed**: Verify API calls work, images load correctly
- **Fallback**: If Gemini fails, use SVG placeholders with proper line art

### 5. UI/UX Polish
- Typography: System fonts, proper hierarchy
- Spacing: Consistent padding/margins (8px grid)
- Loading states: Spinners with messages
- Error handling: User-friendly error dialogs
- Navigation: Smooth transitions, proper headers
- Button states: Active/disabled/hover with visual feedback

## Testing Strategy

### Phase 1: Audit (QA Agent)
- Start the Expo app
- Test EVERY screen and button
- Report all failures and UX issues
- No passes until fully functional

### Phase 2: Development (Dev Agent)
- Implement missing features
- Fix reported issues
- Test locally after each change
- Commit with detailed messages

### Phase 3: Integration Testing
- Full flow: Create → Preview → Coloring → Checkout → Back
- Edge cases: Empty inputs, rapid clicks, network errors
- Performance: Load times, rendering speed

### Phase 4: QA Verification
- Retest after fixes
- Confirm no regressions
- Sign off on feature completeness

## Acceptance Criteria

✅ App loads without crashes
✅ Create flow: Questions → Chat → Generation (shows loading)
✅ Images generate and display correctly
✅ Preview screen shows all pages with thumbnails
✅ Coloring screen: Interactive canvas with draw capability
✅ Color picker with preset palettes + custom color
✅ Instant palette switching (no regeneration)
✅ Save drawn work to device
✅ My Books screen loads all created/saved books
✅ Checkout: Size, binding, quantity, second book discount all calculate correctly
✅ No console errors or warnings
✅ UI is clean, polished, e-commerce-grade
✅ All text readable, buttons responsive
✅ Persistent storage works across sessions

## Files to Watch

- `App.jsx` — Navigation structure
- `screens/CreateBookScreen.jsx` — Book creation flow
- `screens/PreviewScreen.jsx` — Preview with thumbnails
- `screens/ColoringScreen.jsx` — NEEDS MAJOR REWRITE (add canvas)
- `screens/MyBooksScreen.jsx` — Book persistence
- `screens/CheckoutScreen.jsx` — Pricing logic (already solid)
- `utils/nanoBananaAPI.js` — Image generation
- `utils/promptEngine.js` — Prompt synthesis

## Next Steps

1. QA Agent: Audit the app as-is
2. Dev Agent: Review code, start with image generation + color variants
3. Iterate: Fix → Test → Report → Fix until done
4. Final verification: All features working, UI polished

---

**Goal**: Fully functional e-commerce coloring book app, indistinguishable from a production app (minus Stripe payment processing).
