# Shared UI / async helpers

Prefer `src/shared/` source over this file when unsure.

Import from `@/shared`.

| Export | Kind | Use |
|--------|------|-----|
| `useAsyncOperation` | composable | loading / error / success around an async call |
| `useFormValidation` | composable | Vuetify form ref + common rules |
| `useDarkModeToggle` | composable | theme toggle |
| `AppAlert` | component | user feedback |
| `LoadingOverlay` | component | blocking load state |
| `AppDialog` | component | modal wrapper |
| `AuthCard` | component | login / setup card shell |
| `AppNavbar` | component | app bar (usually only in `App.vue`) |
| errors (`UnauthorizedError`, …) | classes | thrown by Axios interceptor in `@/api/client` |
| `date` / `jwt` / `file` utils | helpers | formatting, token parse, downloads |

## `useAsyncOperation` (sketch)

```ts
import { useAsyncOperation } from '@/shared'

const { loading, error, success, execute, reset } = useAsyncOperation<MyType>({
  errorMessage: 'Failed to load',
})

const result = await execute(() => listSomething())
```

## `useFormValidation` (sketch)

```ts
import { useFormValidation } from '@/shared'

const { formRef, rules, validate, reset } = useFormValidation()
// :rules="[rules.required, rules.email]" on v-text-field
```

Typed API errors: catch `UnauthorizedError`, `ValidationError`, `ForbiddenError`, etc. from `@/shared/errors` (re-exported via `@/shared`).
