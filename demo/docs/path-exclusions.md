---
sidebar_position: 4
---

# Path Exclusions

The `excludePaths` option prevents pageview events from firing on specific paths.

## Configuration

Pass an array of bare regex patterns (strings, not regex literals):

```ts
{
  domain: 'your-site.com',
  excludePaths: ['^/admin', '^/staging', 'preview'],
}
```

Each pattern is compiled to a `RegExp` and tested against `window.location.pathname`. If any pattern matches, the pageview is suppressed.

## Pattern syntax

| Pattern | Matches |
| ------- | ------- |
| `^/admin` | Any path starting with `/admin` |
| `^/admin$` | Exactly `/admin` (no sub-paths) |
| `preview` | Any path containing the word `preview` |
| `\\.(json\|xml)$` | Paths ending in `.json` or `.xml` |

:::warning Bare patterns only
Pass patterns without regex delimiters. `"^/admin"` is correct; `"/^\/admin/"` is not — the slashes become part of the pattern.
:::

## How it works

At build time the plugin converts `excludePaths` to:

```html
<script>
  window.plausibleExcludePaths = ["^/admin","preview"].map(function(p){ return new RegExp(p); });
</script>
```

The client module then checks this array on every route change before calling `window.plausible('pageview')`.
