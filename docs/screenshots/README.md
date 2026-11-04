# Distribution CRM — Portfolio Demo and Screenshot Guide

The six existing screenshot files still show previous client branding and are **not publication-ready**. Replace them manually after checking the Distribution CRM wordmark, browser title, and generic favicon. Use synthetic data only; never connect this portfolio demo to a client API.

## Start the demo

From the repository root, with dependencies installed:

```sh
VITE_DEMO_MODE=true npm run dev
```

Open the app on port 8000. On shells without inline environment variables, set `VITE_DEMO_MODE=true` in the ignored `.env.local` and restart Vite.

Only the exact string `true` enables the demo. An absent flag or `false` retains the normal application behavior and backend requirement. For a static demo build, use `VITE_DEMO_MODE=true npm run build`, then `npm run preview`; changing the preview environment does not change an already-built bundle.

## Supported behavior

- **Total Sales** (`/total-sales`): four fictional products in two groups, seven daily columns, missing-day normalization, grouped totals, and agent filtering. Every selected month/year uses the same deterministic fictional daily pattern, not historical business results.
- **Promotion Builder** (`/promotions`): four fictional campaign seeds, the existing two-step form, individual/group product selection, and creation of in-memory promotions. Search and list refresh use the synthetic records.
- **Route Ordering** (`/route-orders`): two fictional agents, seven weekdays, six fictional outlets, drag-and-drop ordering, and explicit in-memory saves per agent/day.
- **Outlets** (`/points-of-sale`): 12 fictional outlets, name search on Enter/clear, agent/city/district filters, equipment summaries, and read-only custom table cells. Demo pagination uses 10/20 rows (initially 10); the independent six-outlet route fixture is unchanged.

The demo uses an exclusive Axios adapter. Unsupported requests—including absolute URLs—fail locally with “Unavailable in portfolio demo.” Promotion editing/blocking and spreadsheet exports are not implemented. Only the four supported areas appear in navigation; other routes, including outlet details and transfers, redirect to Total Sales. Outlet creation, editing, blocking, uploads, exports, and advanced filters are hidden in demo mode.

There is no login, fake token, or backend persistence. Admin UI visibility is provided in memory. Existing authentication storage is not read or modified. Promotions and saved route orders reset on browser reload; navigation and filter changes retain the current session's in-memory changes. Do not enter real names or business details into demo forms.

## Recapture the four supported screens

Keep the existing file paths so README embeds and links remain valid:

| File                     | Application state                              | README placement       |
| ------------------------ | ---------------------------------------------- | ---------------------- |
| `total-sales.png`        | Total Sales report                             | Primary screenshot     |
| `promotion-builder.png`  | Promotions list with four seeded campaigns     | Promotions section     |
| `route-ordering.png`     | Ordered outlet visits for a selected agent/day | Route Ordering section |
| `outlets.png`            | Read-only outlet list and primary filters      | Outlets section        |
| `promotion-builder1.png` | Builder step 1: campaign details               | Linked step evidence   |
| `promotion-builder2.png` | Builder step 2: product/group selection        | Linked step evidence   |

Match the existing 1920 × 1080 desktop viewport for consistent replacements. Keep the synthetic-data notice visible where possible. Confirm that no previous client logo or wordmark appears anywhere in the capture.

1. **Total Sales → `total-sales.png`:** open `/total-sales`. Leave the agent filter clear to show aggregate values, or select Agent 01. Show the seven day columns, both product groups, subtotal rows, and overall total. All figures are synthetic.
2. **Promotions → `promotion-builder.png`:** open `/promotions` after a reload and capture the four seeded fictional campaigns. Then click Add, enter `Spring Store Campaign` in both name fields, set quantity to 3, and select start/end dates (for example, 1–31 January 2030). Capture step 1 as `promotion-builder1.png`. Continue to step 2, select a fictional product in Single mode, and capture `promotion-builder2.png` with the selection and Previous/Add controls visible. Also verify Group mode can select AvenSpring and its variants. Submitting adds the item to the session's list; it never calls a backend.
3. **Route Ordering → `route-ordering.png`:** open `/route-orders`, select Agent 01 and Monday, drag North Point Shop ahead of Central Market, and save. Change weekday and return to Monday to confirm the order. Capture the list and save control after the success message disappears. Reload resets this save.
4. **Outlets → `outlets.png`:** open `/points-of-sale` on page 1. Show several fictional outlet names, status badges, equipment and staff cells. Optionally select Agent 01 or North City. Search by typing part of an outlet name and pressing Enter; clear the field to restore results. Selecting a city loads its two fictional districts. Clear the district before changing or clearing the city: existing city/district clearing semantics are retained. Ensure no admin controls are visible; double-clicking a row does not open details in demo mode.

Replace all six captures manually in this directory. The root README already embeds four images and links to the two builder steps. After checking every replacement, remove its screenshot-update warning. Do not use generated mockups or edit old logos out of screenshots.

## Other planned captures — not supported by this demo

These remain future tasks and require a separately prepared synthetic environment. Do not use the production/client backend to obtain them.

| File                  | Screen                              | Intended content                                              |
| --------------------- | ----------------------------------- | ------------------------------------------------------------- |
| `orders.png`          | `/orders`                           | Synthetic orders, filters, status/payment columns, pagination |
| `outlet-details.png`  | `/points-of-sale/:id` (not enabled) | General information and related sections                      |
| `product-catalog.png` | `/products/product-list`            | Synthetic catalog rows and controls                           |

Before publishing any capture, review visible text, images, notifications, addresses, amounts, browser chrome, and image metadata. Exclude real records, credentials, tokens, private endpoints, developer tools, infrastructure details, and previous client branding. Git-history cleanup, including removed fonts and historical branding, and asset redistribution review remain separate publication tasks.
