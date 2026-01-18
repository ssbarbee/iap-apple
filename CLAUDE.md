# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `iap-apple`, a TypeScript/Node.js library for validating Apple App Store receipts server-side. It communicates with Apple's verifyReceipt endpoints to validate in-app purchases and subscriptions.

## Common Commands

```bash
# Install dependencies (use pnpm)
pnpm install

# Build the project (outputs to dist/)
pnpm build

# Run all tests
pnpm test

# Run a single test file
pnpm mocha --require ts-node/register/transpile-only src/__tests__/index.spec.ts

# Type checking
pnpm ts:check-types

# Lint
pnpm lint:check
pnpm lint:fix

# Format
pnpm prettier:check
pnpm prettier:fix

# Full code quality check (types + prettier + lint)
pnpm code-quality:check
```

## Architecture

### Directory Structure
- `src/lib/shared/` - Public API functions exported to consumers (`verify`, `isVerifiedReceipt`, `getPurchasedItems`, `isPurchasedItemExpired`, `isPurchasedItemCanceled`)
- `src/lib/internal/` - Internal implementation (HTTP requests to Apple, response parsing)
- `src/types/shared/` - Public TypeScript interfaces (`IIAPAppleConfig`, `PurchasedItem`, `IAPAppleError`, `IVerifyReceiptResponseBody`)
- `src/types/internal/` - Internal types (`IReceiptInAppItem`)
- `src/constants/shared/` - Public constants (`RECEIPT_STATUS_ENUM`)
- `src/constants/internal/` - Internal constants (Apple endpoints, status message mappings)

### Key Patterns
- **shared vs internal**: Code in `shared/` directories is exported publicly via `src/index.ts`. Code in `internal/` directories is for internal use only.
- **Validation flow**: `verify()` tries production endpoint first, falls back to sandbox if status 21007 is returned. Set `test: true` to skip production.
- **Error handling**: Failed validations reject with `IAPAppleError` containing `rejectionMessage` and optional `data` (the Apple response).

### Testing
- Uses Mocha + Chai
- Tests are in `src/__tests__/`
- Test receipts stored in `src/__tests__/receipts/`

## Code Style

- Single quotes for strings
- Trailing commas
- 120 character line width
- Exports should be sorted alphabetically (enforced by eslint `sort-export-all` plugin)
