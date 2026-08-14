## tagma — Vue 3 + Vite Admin Panel

### Overview

tagma is an admin panel for managing trade channels, users, products, orders, and more. Built with Vue 3, Vite, TypeScript, Pinia, Vue Router, Element Plus, TailwindCSS, and i18n.

### Tech Stack

- **Vue 3**, **Vite**, **TypeScript**
- **Pinia**, **Vue Router**, **i18n** (locales: `ru`, `tm`)
- **Element Plus**, **TailwindCSS**
- **Axios**, **Vue Viewer**, **Vue Toastify**

### Getting Started

- **Prerequisites**: Node.js 18+ (recommended: 20+), npm
- **Install**:

```sh
npm install
```

- **Development (HMR)**:

```sh
npm run dev
```

Default: `http://localhost:8000`

- **Production build**:

```sh
npm run build
```

- **Preview build**:

```sh
npm run preview
```

### Environment (.env.local)

Create `.env.local` at the project root:

```env
VITE_APP_BASE_URL=https://api.example.com
VITE_APP_IMAGE_URL=https://cdn.example.com
```

Notes:

- Requests include `Authorization: Bearer <TOKEN>` and `language` headers (defaults to `ru`).
- Auth guard redirects unauthenticated users to `/login`.

### Scripts

- `npm run dev` — start dev server (port 8000)
- `npm run build` — production build
- `npm run preview` — preview built app
- `npm run type-check` — type-check with `vue-tsc`
- `npm run lint` — run ESLint
- `npm run format` — format with Prettier

### Key Routes

- `city-manager`, `trade-channels`, `sales-categories`
- `products/product-types`, `products/product-list`
- `drivers`, `merchandisers`, `ekspeditors`, `sales-agents`
- `points-of-sale`, `points-of-transfer`, `routes`, `route-orders`
- `orders`, `discounts`, `gifts`, `promotions`, `plan`, `sales`, `total-sales`
- `users`, `logs`, `manual`, `furniture`
- Login: `/login`

### Structure (short)

- `src/pages` — views
- `src/components` — UI components
- `src/store` — Pinia stores
- `src/api` — API calls (Axios)
- `src/router` — routes
- `src/i18n` — translations (`ru.json`, `tm.json`)
- `src/utils/request.ts` — Axios instance and interceptors

### IDE

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
