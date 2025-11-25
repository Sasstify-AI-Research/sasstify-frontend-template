# Add shadcn Component Script - Test Implementation

Documentation for the automated test implementation for `add-shadcn-component.js`.

---

## Test Files Created

### 1. `tests/scripts/add-shadcn-component.test.ts`

Comprehensive test suite covering:
- Component adaptation
- Type extraction
- Style extraction
- Folder structure
- Import updates
- Test file generation
- Validation
- Error handling
- Integration with other scripts

---

## Test Structure

### Test Helper Functions

**`createMockShadcnComponent()`**
- Creates mock shadcn component files for testing
- Simulates what shadcn CLI would create
- Supports options:
  - `hasTypes`: Include TypeScript interfaces
  - `hasStyles`: Include Tailwind classes
  - `exportType`: Named or default export

### Test Categories

1. **Component Adaptation Tests**
   - Adapt component with types and styles
   - Create test file
   - Extract types to separate file
   - Create CSS module when styles detected

2. **Validation Tests**
   - Reject invalid component name format
   - Reject empty component name

3. **Error Handling Tests**
   - Handle component already exists
   - Display help command

4. **Folder Structure Tests**
   - Create correct folder structure
   - Remove original flat file

5. **Import Updates Tests**
   - Update component imports correctly

6. **Test File Generation Tests**
   - Generate test file with named export
   - Generate test file with default export

7. **Integration Tests**
   - Work with delete component script

---

## Running Tests

### Run All Script Tests

```bash
npm run test:scripts
```

### Run Specific Test File

```bash
npm test tests/scripts/add-shadcn-component.test.ts
```

### Run in Watch Mode

```bash
npm run test:watch tests/scripts/add-shadcn-component.test.ts
```

### Run with Coverage

```bash
npm run test:coverage tests/scripts/add-shadcn-component.test.ts
```

---

## Test Limitations

### Current Implementation

The current tests will **actually call shadcn CLI** which means:
- ✅ Tests real integration with shadcn
- ❌ Requires internet connection
- ❌ May be slower
- ❌ May fail if shadcn registry is down

### Future Improvements

For more isolated unit tests, consider:

1. **Mock child_process.spawn**
   ```typescript
   import { vi } from 'vitest';
   vi.mock('child_process', () => ({
     spawn: vi.fn(() => ({
       on: vi.fn((event, callback) => {
         if (event === 'close') callback(0);
       }),
     })),
   }));
   ```

2. **Create Unit Tests for Core Functions**
   - Test `extractTypes()` in isolation
   - Test `extractStyles()` in isolation
   - Test `reorganizeToFolder()` in isolation
   - Test `updateComponentImports()` in isolation

3. **Separate Integration Tests**
   - Keep integration tests that call real shadcn CLI
   - Add unit tests that mock external dependencies

---

## Test Coverage

### Covered Scenarios

- ✅ Basic component adaptation
- ✅ Type extraction
- ✅ Style extraction
- ✅ CSS module creation
- ✅ Test file generation
- ✅ Folder structure creation
- ✅ Import updates
- ✅ Validation
- ✅ Error handling
- ✅ Integration with delete script

### Not Yet Covered (Future Work)

- ⏳ Repository selection (CLI args)
- ⏳ Repository selection (interactive mode)
- ⏳ Multiple components in one command
- ⏳ Network error handling
- ⏳ File system error handling
- ⏳ Complex type extraction (generics, unions)
- ⏳ Multiple interfaces extraction

---

## Test Execution Notes

### Prerequisites

- Node.js installed
- npm dependencies installed
- Internet connection (for integration tests)
- Clean test environment

### Test Isolation

Each test:
- Creates unique component names using timestamps
- Cleans up after itself in `afterEach`
- Comprehensive cleanup in `afterAll`

### Test Data

Tests use:
- `TEST_PREFIX.UI_COMPONENT` for component names
- Mock component files that simulate shadcn output
- Temporary files that are cleaned up

---

## Debugging Tests

### View Test Output

```bash
npm test tests/scripts/add-shadcn-component.test.ts -- --reporter=verbose
```

### Run Single Test

```bash
npm test tests/scripts/add-shadcn-component.test.ts -t "should adapt component"
```

### Debug Failed Test

1. Check test output for error messages
2. Verify mock component file was created
3. Check if script actually ran
4. Verify cleanup happened correctly

---

## Adding New Tests

### Template

```typescript
it('should [test description]', () => {
  const componentName = generateTestName(TEST_PREFIX.UI_COMPONENT);
  createdComponents.push(componentName);
  
  // Setup
  createMockShadcnComponent(componentName, { /* options */ });
  
  // Execute
  const result = runScript('add:shadcn', componentName, { throwOnError: false });
  
  // Verify
  if (result.success || /* condition */) {
    expect(/* assertion */).toBe(/* expected */);
  }
});
```

### Best Practices

1. Always use `generateTestName()` for unique names
2. Add component to `createdComponents` array
3. Clean up in `afterEach`
4. Handle both success and failure cases
5. Use conditional checks for flaky tests

---

## Test Results Interpretation

### Success Criteria

- ✅ All tests pass
- ✅ No test artifacts left behind
- ✅ Clean test environment after run

### Common Issues

**Test fails with "component not found"**
- shadcn CLI couldn't find component
- Check component name is valid
- Verify internet connection

**Test fails with "already exists"**
- Previous test didn't clean up
- Check cleanup logic
- Run cleanup manually

**Test times out**
- shadcn CLI taking too long
- Increase timeout in vitest config
- Check network connection

---

## Continuous Integration

### CI/CD Integration

Tests should run:
- On every pull request
- Before merging to main
- On scheduled basis

### CI Configuration

```yaml
# Example GitHub Actions
- name: Run script tests
  run: npm run test:scripts
```

---

**Test Implementation Version:** 1.0  
**Last Updated:** 2025-01-27  
**Status:** Ready for Execution

