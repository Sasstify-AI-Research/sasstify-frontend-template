# Add shadcn Component Script - Test Plan

Comprehensive test plan for `scripts/add-shadcn-component.js` covering all use cases and edge cases.

---

## Table of Contents

- [Test Overview](#test-overview)
- [Test Environment Setup](#test-environment-setup)
- [Test Cases](#test-cases)
- [Test Execution Plan](#test-execution-plan)
- [Test Data](#test-data)
- [Expected Results](#expected-results)
- [Regression Testing](#regression-testing)

---

## Test Overview

### Purpose
Validate that `add-shadcn-component.js` correctly adapts shadcn components to the project's folder-based structure with proper type extraction, style handling, and test generation.

### Scope
- Component addition via shadcn CLI
- Repository selection (CLI args and interactive)
- Type extraction
- Style extraction and CSS module generation
- Folder reorganization
- Test file generation
- Error handling
- Integration with existing scripts

---

## Test Environment Setup

### Prerequisites
- Node.js installed
- npm dependencies installed (`npm install`)
- Clean `src/components/ui/` directory (or backup existing)
- Clean `tests/unit/components/ui/` directory
- Internet connection (for shadcn CLI)

### Setup Steps
```bash
# 1. Backup existing components (if any)
cp -r src/components/ui src/components/ui.backup

# 2. Clean test directories
rm -rf src/components/ui/*
rm -rf tests/unit/components/ui/*

# 3. Ensure script is executable
chmod +x scripts/add-shadcn-component.js
```

---

## Test Cases

### TC-01: Basic Component Addition

**Description:** Add a single shadcn component (button) with default settings

**Steps:**
1. Run: `npm run add:shadcn button`
2. Verify component file created: `src/components/ui/button/Button.tsx`
3. Verify types file created: `src/components/ui/button/Button.types.ts`
4. Verify test file created: `tests/unit/components/ui/Button.test.tsx`
5. Verify original flat file removed: `src/components/ui/button.tsx` should not exist
6. Verify folder structure matches expected format

**Expected Results:**
- ✅ Component adapted successfully
- ✅ All files in correct locations
- ✅ Types extracted correctly
- ✅ Test file generated
- ✅ Summary displayed

**Priority:** High

---

### TC-02: Multiple Components Addition

**Description:** Add multiple components in a single command

**Steps:**
1. Run: `npm run add:shadcn button card dialog`
2. Verify all three components adapted
3. Verify each has correct folder structure
4. Verify no conflicts between components

**Expected Results:**
- ✅ All components adapted successfully
- ✅ Each component in separate folder
- ✅ No file conflicts

**Priority:** High

---

### TC-03: Repository Selection - CLI Argument (--registry)

**Description:** Use custom registry URL via CLI argument

**Steps:**
1. Run: `npm run add:shadcn button --registry=https://ui.shadcn.com`
2. Verify shadcn CLI called with `--registry` flag
3. Verify component added from specified registry

**Expected Results:**
- ✅ Registry flag passed to shadcn CLI
- ✅ Component added successfully

**Priority:** Medium

---

### TC-04: Repository Selection - CLI Argument (--repo)

**Description:** Use repository name via CLI argument

**Steps:**
1. Run: `npm run add:shadcn button --repo=official`
2. Verify repository mapped correctly
3. Verify component added successfully

**Test Variations:**
- `--repo=default`
- `--repo=shadcn`
- `--repo=invalid` (should warn and use default)

**Expected Results:**
- ✅ Repository name mapped correctly
- ✅ Component added successfully
- ✅ Warning shown for invalid repo name

**Priority:** Medium

---

### TC-05: Repository Selection - Interactive Mode

**Description:** Prompt for repository selection when not specified

**Steps:**
1. Run: `npm run add:shadcn button` (without registry flags)
2. Select option 1 (Default)
3. Verify component added with default registry
4. Repeat with option 2 (Custom URL)
5. Enter custom URL
6. Verify component added with custom registry

**Expected Results:**
- ✅ Prompt displayed correctly
- ✅ Default option works
- ✅ Custom URL option works
- ✅ Component added successfully

**Priority:** Medium

---

### TC-06: Component Already Exists - Folder Structure

**Description:** Attempt to add component that already exists in adapted structure

**Steps:**
1. Run: `npm run add:shadcn button` (first time)
2. Verify component created
3. Run: `npm run add:shadcn button` (second time)
4. Verify error message displayed
5. Verify no duplicate files created

**Expected Results:**
- ✅ Error message: "Component already exists in adapted structure"
- ✅ No duplicate files
- ✅ Script continues or exits gracefully

**Priority:** High

---

### TC-07: Component Already Exists - Flat File

**Description:** Handle case where flat file exists but folder doesn't

**Steps:**
1. Manually create: `src/components/ui/button.tsx`
2. Run: `npm run add:shadcn button`
3. Verify script handles existing flat file
4. Verify component adapted correctly

**Expected Results:**
- ✅ Script detects existing flat file
- ✅ Component adapted successfully
- ✅ Original flat file removed after adaptation

**Priority:** Medium

---

### TC-08: Invalid Component Name

**Description:** Validate component name format

**Steps:**
1. Run: `npm run add:shadcn Button` (PascalCase)
2. Verify validation error
3. Run: `npm run add:shadcn button_comp` (underscore)
4. Verify validation error
5. Run: `npm run add:shadcn button comp` (space)
6. Verify validation error

**Expected Results:**
- ✅ Validation error displayed
- ✅ Script exits with error code
- ✅ No files created

**Priority:** High

---

### TC-09: Type Extraction - Simple Interface

**Description:** Extract simple TypeScript interface

**Steps:**
1. Add component with simple props interface
2. Verify types extracted to `.types.ts` file
3. Verify types import added to component
4. Verify types file content matches original

**Test Component:** `button` (typically has ButtonProps interface)

**Expected Results:**
- ✅ Types extracted correctly
- ✅ Types file created
- ✅ Import statement added
- ✅ Types content matches original

**Priority:** High

---

### TC-10: Type Extraction - Complex Types

**Description:** Extract complex TypeScript types (unions, generics, extended interfaces)

**Steps:**
1. Add component with complex types
2. Verify all types extracted correctly
3. Verify JSDoc comments preserved
4. Verify complex type syntax preserved

**Test Component:** `select` or `combobox` (typically has complex types)

**Expected Results:**
- ✅ All types extracted
- ✅ Complex syntax preserved
- ✅ JSDoc comments included

**Priority:** Medium

---

### TC-11: Type Extraction - Multiple Interfaces

**Description:** Extract multiple TypeScript interfaces from single component

**Steps:**
1. Add component with multiple interfaces
2. Verify all interfaces extracted
3. Verify all interfaces in types file
4. Verify imports updated correctly

**Expected Results:**
- ✅ All interfaces extracted
- ✅ All interfaces in types file
- ✅ Correct imports

**Priority:** Medium

---

### TC-12: Style Extraction - Tailwind Classes Detected

**Description:** Detect Tailwind classes and create CSS module

**Steps:**
1. Add component with Tailwind classes in className
2. Verify styles detected
3. Verify CSS module file created
4. Verify CSS module import added to component
5. Verify CSS module template created

**Test Component:** `button` (typically has Tailwind classes)

**Expected Results:**
- ✅ Styles detected
- ✅ CSS module file created: `[Component].module.css`
- ✅ Import statement added
- ✅ Template CSS provided

**Priority:** High

---

### TC-13: Style Extraction - No Styles Detected

**Description:** Component without styles should not create CSS module

**Steps:**
1. Add component without className or style props
2. Verify no CSS module created
3. Verify no CSS import added

**Expected Results:**
- ✅ No CSS module file created
- ✅ No CSS import statement
- ✅ Component adapted successfully

**Priority:** Medium

---

### TC-14: Style Extraction - Inline Styles Detected

**Description:** Detect inline style props

**Steps:**
1. Add component with inline `style` prop
2. Verify styles detected
3. Verify CSS module created

**Expected Results:**
- ✅ Inline styles detected
- ✅ CSS module created

**Priority:** Low

---

### TC-15: Import Updates - Types Import

**Description:** Verify types import added correctly

**Steps:**
1. Add component with types extracted
2. Verify import statement: `import { ComponentProps } from './Component.types'`
3. Verify import placed correctly (after other imports)
4. Verify no duplicate imports

**Expected Results:**
- ✅ Types import added
- ✅ Correct import path
- ✅ Proper placement
- ✅ No duplicates

**Priority:** High

---

### TC-16: Import Updates - CSS Module Import

**Description:** Verify CSS module import added correctly

**Steps:**
1. Add component with styles detected
2. Verify import statement: `import styles from './Component.module.css'`
3. Verify import placed correctly
4. Verify no duplicate imports

**Expected Results:**
- ✅ CSS import added
- ✅ Correct import path
- ✅ Proper placement

**Priority:** High

---

### TC-17: Import Updates - Preserve Existing Imports

**Description:** Verify existing imports preserved and updated correctly

**Steps:**
1. Add component with multiple imports (Radix UI, Lucide icons, etc.)
2. Verify all original imports preserved
3. Verify new imports (types, CSS) added correctly
4. Verify import order maintained

**Expected Results:**
- ✅ All original imports preserved
- ✅ New imports added
- ✅ Import order logical

**Priority:** High

---

### TC-18: Test File Generation - Named Export

**Description:** Generate test file for component with named export

**Steps:**
1. Add component with named export (`export { Button }`)
2. Verify test file created
3. Verify test uses named import: `import { Button } from ...`
4. Verify test structure matches template

**Expected Results:**
- ✅ Test file created
- ✅ Named import used
- ✅ Test structure correct

**Priority:** High

---

### TC-19: Test File Generation - Default Export

**Description:** Generate test file for component with default export

**Steps:**
1. Add component with default export (`export default Button`)
2. Verify test file created
3. Verify test uses default import: `import Button from ...`
4. Verify test structure matches template

**Expected Results:**
- ✅ Test file created
- ✅ Default import used
- ✅ Test structure correct

**Priority:** Medium

---

### TC-20: Folder Structure - Correct Organization

**Description:** Verify component organized in correct folder structure

**Steps:**
1. Add component
2. Verify folder created: `src/components/ui/[component]/`
3. Verify component file: `[Component].tsx`
4. Verify types file: `[Component].types.ts` (if types extracted)
5. Verify CSS file: `[Component].module.css` (if styles detected)
6. Verify original flat file removed

**Expected Results:**
- ✅ Correct folder structure
- ✅ All files in correct locations
- ✅ Original flat file removed

**Priority:** High

---

### TC-21: Error Handling - shadcn CLI Failure

**Description:** Handle shadcn CLI errors gracefully

**Steps:**
1. Run with invalid component name: `npm run add:shadcn invalid-component-xyz`
2. Verify error message displayed
3. Verify script exits gracefully
4. Verify no partial files created

**Expected Results:**
- ✅ Error message displayed
- ✅ Script exits with error code
- ✅ No partial files created

**Priority:** High

---

### TC-22: Error Handling - Network Issues

**Description:** Handle network failures during shadcn CLI execution

**Steps:**
1. Disconnect internet
2. Run: `npm run add:shadcn button`
3. Verify error message displayed
4. Verify script handles error gracefully

**Expected Results:**
- ✅ Network error detected
- ✅ Error message displayed
- ✅ Script exits gracefully

**Priority:** Medium

---

### TC-23: Error Handling - File System Errors

**Description:** Handle file system errors (permissions, disk space)

**Steps:**
1. Create read-only directory: `chmod -w src/components/ui`
2. Run: `npm run add:shadcn button`
3. Verify error message displayed
4. Restore permissions and verify works

**Expected Results:**
- ✅ Permission error detected
- ✅ Error message displayed
- ✅ Script exits gracefully

**Priority:** Low

---

### TC-24: Help Command

**Description:** Display usage help

**Steps:**
1. Run: `npm run add:shadcn -- --help`
2. Verify help text displayed
3. Run: `npm run add:shadcn -- -h`
4. Verify help text displayed

**Expected Results:**
- ✅ Help text displayed
- ✅ Usage examples shown
- ✅ Options documented

**Priority:** Low

---

### TC-25: Empty Component Name

**Description:** Handle missing component name

**Steps:**
1. Run: `npm run add:shadcn`
2. Verify error message displayed
3. Verify usage help shown

**Expected Results:**
- ✅ Error message displayed
- ✅ Usage help shown
- ✅ Script exits with error code

**Priority:** High

---

### TC-26: Integration - Component Analysis

**Description:** Verify adapted component works with analysis script

**Steps:**
1. Add component: `npm run add:shadcn button`
2. Run: `npm run analyze:components`
3. Verify component appears in analysis
4. Verify component structure detected correctly

**Expected Results:**
- ✅ Component detected by analysis script
- ✅ Structure recognized correctly
- ✅ No errors in analysis

**Priority:** High

---

### TC-27: Integration - Component Deletion

**Description:** Verify adapted component can be deleted using delete script

**Steps:**
1. Add component: `npm run add:shadcn button`
2. Run: `npm run delete:component -- --name=ui/button`
3. Verify component deleted
4. Verify types file deleted
5. Verify CSS module deleted
6. Verify test file deleted

**Expected Results:**
- ✅ Component deleted successfully
- ✅ All related files deleted
- ✅ No orphaned files

**Priority:** High

---

### TC-28: Summary Output

**Description:** Verify summary output displays correctly

**Steps:**
1. Add component
2. Verify summary displayed
3. Verify files listed correctly
4. Verify import example shown
5. Verify next steps displayed

**Expected Results:**
- ✅ Summary displayed
- ✅ All created files listed
- ✅ Import example correct
- ✅ Next steps helpful

**Priority:** Medium

---

### TC-29: Batch Processing - Multiple Components

**Description:** Process multiple components sequentially

**Steps:**
1. Run: `npm run add:shadcn button card dialog`
2. Verify all components processed
3. Verify each component adapted correctly
4. Verify no conflicts between components

**Expected Results:**
- ✅ All components processed
- ✅ Each adapted correctly
- ✅ No conflicts

**Priority:** Medium

---

### TC-30: Edge Case - Component with No Props

**Description:** Handle component without props interface

**Steps:**
1. Add component that doesn't export props interface
2. Verify script handles gracefully
3. Verify component adapted (no types file if no types)

**Expected Results:**
- ✅ Script handles gracefully
- ✅ Component adapted
- ✅ No types file if no types found

**Priority:** Low

---

## Test Execution Plan

### Phase 1: Core Functionality (High Priority)
- TC-01: Basic Component Addition
- TC-06: Component Already Exists - Folder Structure
- TC-08: Invalid Component Name
- TC-09: Type Extraction - Simple Interface
- TC-12: Style Extraction - Tailwind Classes Detected
- TC-15: Import Updates - Types Import
- TC-16: Import Updates - CSS Module Import
- TC-20: Folder Structure - Correct Organization
- TC-21: Error Handling - shadcn CLI Failure

### Phase 2: Advanced Features (Medium Priority)
- TC-02: Multiple Components Addition
- TC-03: Repository Selection - CLI Argument (--registry)
- TC-04: Repository Selection - CLI Argument (--repo)
- TC-05: Repository Selection - Interactive Mode
- TC-10: Type Extraction - Complex Types
- TC-11: Type Extraction - Multiple Interfaces
- TC-17: Import Updates - Preserve Existing Imports
- TC-18: Test File Generation - Named Export
- TC-26: Integration - Component Analysis
- TC-27: Integration - Component Deletion

### Phase 3: Edge Cases (Low Priority)
- TC-07: Component Already Exists - Flat File
- TC-13: Style Extraction - No Styles Detected
- TC-14: Style Extraction - Inline Styles Detected
- TC-19: Test File Generation - Default Export
- TC-22: Error Handling - Network Issues
- TC-23: Error Handling - File System Errors
- TC-24: Help Command
- TC-25: Empty Component Name
- TC-28: Summary Output
- TC-29: Batch Processing - Multiple Components
- TC-30: Edge Case - Component with No Props

---

## Test Data

### Test Components
- **button** - Simple component with props and Tailwind classes
- **card** - Component with multiple props
- **dialog** - Complex component with multiple interfaces
- **select** - Component with complex types
- **input** - Simple component, minimal styles

### Test Registry URLs
- Default: `https://ui.shadcn.com` (official)
- Custom: `https://github.com/custom/shadcn-registry` (test)

---

## Expected Results

### Success Criteria
- ✅ All high-priority tests pass
- ✅ All medium-priority tests pass
- ✅ At least 80% of low-priority tests pass
- ✅ No critical bugs found
- ✅ Integration tests pass

### Failure Criteria
- ❌ Any high-priority test fails
- ❌ Multiple medium-priority tests fail
- ❌ Integration tests fail
- ❌ Data loss or corruption

---

## Regression Testing

### After Each Fix
1. Run all high-priority tests
2. Run affected test cases
3. Run integration tests

### Before Release
1. Run complete test suite
2. Test on clean environment
3. Test with real shadcn components
4. Verify integration with all existing scripts

---

## Test Reporting

### Test Results Format
- Test Case ID
- Status (Pass/Fail/Skip)
- Execution Time
- Error Message (if failed)
- Screenshots/Logs (if applicable)

### Metrics to Track
- Test Pass Rate
- Average Execution Time
- Number of Bugs Found
- Bug Severity Distribution

---

**Test Plan Version:** 1.0  
**Last Updated:** 2025-01-27  
**Status:** Ready for Execution

