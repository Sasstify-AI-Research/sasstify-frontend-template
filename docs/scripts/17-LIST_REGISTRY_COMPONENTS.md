# List Registry Components Script

Lists available components from shadcn-compatible registries configured in your project.

## Quick Start

```bash
# List all components from default shadcn registry
npm run list:registry

# List components from a specific registry
npm run list:registry -- --registry=@magicui

# Search for components
npm run list:registry -- --search=button

# Filter by type
npm run list:registry -- --type=ui
```

## CLI Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `--registry=<name>` | Registry to list components from | `shadcn` |
| `--type=<type>` | Filter by component type (ui, hook, block, lib) | All types |
| `--search=<query>` | Search components by name | None |
| `--json` | Output as JSON format | Console format |
| `--help`, `-h` | Show help message | - |

## Usage Examples

### List All Components

```bash
npm run list:registry
```

Output:
```
🔍 Fetching components from shadcn...

📦 Components from shadcn:

   Ui Components (54)
   ────────────────────────────────────────
  accordion        Vertically stacked interactive headings that reveal content sections
  alert            Displays a callout for user attention with contextual feedback
  button           Interactive element for triggering actions and events
  ...

   Total: 54 components

💡 To add a component:
   npx shadcn@latest add button
```

### List from Custom Registry

First, ensure the registry is configured in components.json:
```bash
npm run manage:registry -- --add=@magicui --url=https://magicui.design/r/{name}.json
```

Then list its components:
```bash
npm run list:registry -- --registry=@magicui
```

### Filter by Type

```bash
# List only UI components
npm run list:registry -- --type=ui

# List only hooks
npm run list:registry -- --type=hook
```

### Search Components

```bash
# Search for button-related components
npm run list:registry -- --search=button

# Search in a specific registry
npm run list:registry -- --registry=@aceternity --search=card
```

### JSON Output

```bash
npm run list:registry -- --json
```

Output:
```json
{
  "registry": "shadcn",
  "total": 54,
  "components": [
    {
      "name": "accordion",
      "type": "ui",
      "description": "Vertically stacked interactive headings that reveal content sections",
      "dependencies": ["@radix-ui/react-accordion"],
      "registryDependencies": []
    },
    ...
  ]
}
```

### Combined Filters

```bash
# Search for marquee in magicui, output as JSON
npm run list:registry -- --registry=@magicui --search=marquee --json
```

## Component Types

The script groups components by their type:

| Type | Description |
|------|-------------|
| `ui` | UI components (buttons, inputs, modals, etc.) |
| `hook` | React hooks (use-mobile, use-toast, etc.) |
| `block` | Page blocks and layouts |
| `lib` | Library utilities |
| `style` | Style configurations |

## Registry Configuration

Registries must be configured in `components.json` before they can be used:

```json
{
  "registries": {
    "@magicui": "https://magicui.design/r/{name}.json",
    "@aceternity": "https://ui.aceternity.com/registry/{name}.json"
  }
}
```

Use the [manage-shadcn-registry](./16-MANAGE_SHADCN_REGISTRY.md) script to manage registries:

```bash
# Add a registry
npm run manage:registry -- --add=@magicui --url=https://magicui.design/r/{name}.json

# List configured registries
npm run manage:registry -- --current

# List available registries from shadcn
npm run manage:registry -- --list
```

## Component Descriptions

The script provides descriptions for common shadcn/ui components. For components from other registries or custom components, the description may show the dependency count instead.

## Error Handling

The script handles common errors gracefully:

- **Registry not found**: Falls back to default shadcn registry with a warning
- **Network errors**: Displays a clear error message
- **Empty results**: Shows "No components found" message

## Related Scripts

- [Add Shadcn Component](./12-ADD_SHADCN_COMPONENT.md) - Add components from registries
- [Manage Shadcn Registry](./16-MANAGE_SHADCN_REGISTRY.md) - Configure custom registries
- [Create UI Component](./06-CREATE_UI_COMPONENT.md) - Create custom UI components

## See Also

- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [shadcn Registry Directory](https://ui.shadcn.com/docs/directory)

