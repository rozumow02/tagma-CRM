# Portfolio Demo and Screenshot Guide

No screenshots are included yet. Use synthetic data only; never connect this portfolio demo to a client API.

## Start the demo

From the repository root, with dependencies installed:

```sh
VITE_DEMO_MODE=true npm run dev
```

Open the app on port 8000. On shells without inline environment variables, set `VITE_DEMO_MODE=true` in the ignored `.env.local` and restart Vite.

Only the exact string `true` enables the demo. An absent flag or `false` retains the normal application behavior and backend requirement. For a static demo build, use `VITE_DEMO_MODE=true npm run build`, then `npm run preview`; changing the preview environment does not change an already-built bundle.

## Supported behavior

- **Total Sales** (`/total-sales`): four fictional products in two groups, seven daily columns, missing-day normalization, grouped totals, and agent filtering. Every selected month/year uses the same deterministic fictional daily pattern, not historical business results.
- **Promotion Builder** (`/promotions`): existing two-step form, individual/group product selection, and creation of in-memory promotions. Search and list refresh use the synthetic records.
- **Route Ordering** (`/route-orders`): two fictional agents, seven weekdays, six Demo Markets, drag-and-drop ordering, and explicit in-memory saves per agent/day.

The demo uses an exclusive Axios adapter. Unsupported requests—including absolute URLs—fail locally with “Unavailable in portfolio demo.” Promotion editing/blocking and spreadsheet exports are not implemented. Only the three supported screens appear in navigation; other routes redirect to Total Sales.

There is no login, fake token, or backend persistence. Admin UI visibility is provided in memory. Existing authentication storage is not read or modified. Promotions and saved route orders reset on browser reload; navigation and filter changes retain the current session's in-memory changes. Do not enter real names or business details into demo forms.

## Capture the three supported screens

Use a consistent desktop viewport, such as 1440 × 900. Keep the synthetic-data notice visible where possible.

1. **Total Sales → `total-sales.png`:** open `/total-sales`. Leave the agent filter clear to show aggregate values, or select Agent Demo 01. Show the seven day columns, both product groups, subtotal rows, and overall total. All figures are synthetic.
2. **Promotion Builder → `promotion-builder.png`:** open `/promotions`, click Add, enter `Demo Promotion 02` in both name fields, set quantity to 3, and select start/end dates (for example, 1–31 January 2030). Continue to the second step, choose group selection, and select Demo Group Alpha. Capture the dialog with its fictional variants. Submitting adds the item to the session's list; it never calls a backend.
3. **Route Ordering → `route-ordering.png`:** open `/route-orders`, select Agent Demo 01 and Monday, drag Demo Market 03 ahead of Demo Market 01, and save. Change weekday and return to Monday to confirm the order. Capture the list and save control after the success message disappears. Reload resets this save.

Save captures manually in this directory. Once reviewed, add actual image embeds to the root README, prioritizing Total Sales, Promotion Builder, and Route Ordering. Do not use generated mockups as screenshots.

## Other planned captures — not supported by this demo

These remain future tasks and require a separately prepared synthetic environment. Do not use the production/client backend to obtain them.

| File | Screen | Intended content |
| --- | --- | --- |
| `orders.png` | `/orders` | Synthetic orders, filters, status/payment columns, pagination |
| `outlet-details.png` | `/points-of-sale` → synthetic outlet | General information and related sections |
| `product-catalog.png` | `/products/product-list` | Synthetic catalog rows and controls |

Before publishing any capture, review visible text, images, notifications, addresses, amounts, and browser chrome. Exclude real records, credentials, tokens, private endpoints, developer tools, and infrastructure details. Branding/font history and publication permissions remain separate from demo data isolation.
