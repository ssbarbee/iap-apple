| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ----------------------- | ------------------------- | ----------------- |
| ![Statements](https://img.shields.io/badge/statements-93.54%25-brightgreen.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-82.92%25-yellow.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-93.75%25-brightgreen.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-93.16%25-brightgreen.svg?style=flat) |

# iap-apple

[![npm version](https://img.shields.io/npm/v/iap-apple.svg)](https://www.npmjs.com/package/iap-apple)
[![npm downloads](https://img.shields.io/npm/dw/iap-apple.svg)](https://www.npmjs.com/package/iap-apple)
[![GitHub issues](https://img.shields.io/github/issues-raw/ssbarbee/iap-apple.svg)](https://github.com/ssbarbee/iap-apple/issues)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

**Lightweight Apple App Store receipt validation for Node.js** - Zero dependencies, TypeScript-first, blazing fast.

## Why iap-apple? 🤔

| Feature | iap-apple | Others |
|---------|-----------|--------|
| Runtime Dependencies | **0** | 5-10+ |
| TypeScript | **Native** | Partial/None |
| Bundle Size | **~15KB** | 100KB+ |
| Node.js Fetch | **Native** | axios/request |
| Maintained | **2024+** | Often stale |

- **Zero Dependencies** - Uses Node.js native `fetch`, no bloat
- **TypeScript-First** - Full type definitions, great IDE support
- **Production Ready** - 93%+ test coverage, battle-tested
- **Simple API** - One function to validate, intuitive helpers

## Installation 📦

```bash
# pnpm (recommended)
pnpm add iap-apple

# npm
npm install iap-apple

# yarn
yarn add iap-apple
```

**Requirements:** Node.js 22+

## Quick Start 🚀

```typescript
import { verify, getPurchasedItems, isPurchasedItemExpired } from 'iap-apple';

// Validate a receipt
const response = await verify(receiptData, {
  appSharedSecret: 'your-shared-secret',
});

// Get purchased items (sorted by date, deduplicated)
const items = getPurchasedItems(response);

// Check subscription status
const latestPurchase = items[0];
if (!isPurchasedItemExpired(latestPurchase)) {
  console.log('Subscription is active!');
}
```

## API Reference 📚

### verify(receipt, config)

Validates a receipt against Apple's verifyReceipt endpoint. Automatically handles production/sandbox fallback.

```typescript
import { verify, IAPAppleError } from 'iap-apple';

try {
  const response = await verify(receiptData, {
    // Required: Your app's shared secret from App Store Connect
    appSharedSecret: 'your-shared-secret',

    // Optional: Exclude old transactions (default: false)
    appleExcludeOldTransactions: true,

    // Optional: Force sandbox environment (default: false)
    test: false,

    // Optional: Debug logging
    logger: console,
  });

  console.log('Receipt validated:', response.status === 0);
} catch (error) {
  const { rejectionMessage, data } = error as IAPAppleError;
  console.error('Validation failed:', rejectionMessage);
}
```

### isVerifiedReceipt(response)

Check if a receipt validation was successful.

```typescript
import { verify, isVerifiedReceipt } from 'iap-apple';

const response = await verify(receipt, config);
if (isVerifiedReceipt(response)) {
  // Receipt is valid
}
```

### getPurchasedItems(response)

Extract purchased items from the response. Returns items sorted by purchase date (newest first), deduplicated by `original_transaction_id`.

```typescript
import { verify, getPurchasedItems } from 'iap-apple';

const response = await verify(receipt, config);
const items = getPurchasedItems(response);

for (const item of items) {
  console.log(`Product: ${item.productId}`);
  console.log(`Purchased: ${new Date(item.purchaseDateMS)}`);
  console.log(`Expires: ${item.expirationDateMS ? new Date(item.expirationDateMS) : 'Never'}`);
}
```

### isPurchasedItemExpired(item)

Check if a subscription has expired or been cancelled.

```typescript
import { getPurchasedItems, isPurchasedItemExpired } from 'iap-apple';

const items = getPurchasedItems(response);
const subscription = items[0];

if (isPurchasedItemExpired(subscription)) {
  console.log('Subscription expired or cancelled');
} else {
  console.log('Subscription is active');
}
```

### isPurchasedItemCanceled(item)

Check if a purchase was cancelled (refunded).

```typescript
import { getPurchasedItems, isPurchasedItemCanceled } from 'iap-apple';

const items = getPurchasedItems(response);
if (isPurchasedItemCanceled(items[0])) {
  console.log('User received a refund');
}
```

## Types 📝

### PurchasedItem

```typescript
interface PurchasedItem {
  bundleId: string;
  appItemId: string;
  transactionId: string;
  originalTransactionId?: string;
  productId: string;
  purchaseDateMS: number;
  originalPurchaseDateMS?: number;
  expirationDateMS?: number;
  cancellationDateMS?: number;
  isTrialPeriod: boolean;
  quantity: number;
}
```

### IIAPAppleConfig

```typescript
interface IIAPAppleConfig {
  appSharedSecret: string;           // Required
  appleExcludeOldTransactions?: boolean;  // Default: false
  test?: boolean;                    // Default: false
  logger?: ILogger | null;           // Default: null
}
```

### Error Handling

All errors are thrown as `IAPAppleError`:

```typescript
interface IAPAppleError {
  rejectionMessage: string;
  data?: IVerifyReceiptResponseBody | null;
}
```

Common status codes:
- `21002` - Malformed receipt data
- `21003` - Receipt authentication failed
- `21004` - Shared secret mismatch
- `21005` - Apple server unavailable
- `21006` - Subscription expired
- `21007` - Sandbox receipt sent to production
- `21008` - Production receipt sent to sandbox

## StoreKit 2 / App Store Server API 🆕

This library uses Apple's legacy `verifyReceipt` endpoint, which still works but is deprecated for new apps.

For new projects using **StoreKit 2**, consider Apple's official library:

```bash
npm install @apple/app-store-server-library
```

**When to use iap-apple:**
- Existing apps using StoreKit 1
- Need zero dependencies
- Want a simpler API
- Validating receipts from older iOS versions

**When to use Apple's library:**
- New apps with StoreKit 2
- Need App Store Server Notifications V2
- Need subscription offer signing

## Contributing 🤝

Contributions are welcome! Please open an issue or submit a PR.

## License 📄

ISC
