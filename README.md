| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ----------------------- | ------------------------- | ----------------- |
| ![Statements](https://img.shields.io/badge/statements-93.54%25-brightgreen.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-82.92%25-yellow.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-93.75%25-brightgreen.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-93.16%25-brightgreen.svg?style=flat) |

# iap-apple

![https://img.shields.io/npm/v/iap-apple](https://img.shields.io/npm/v/iap-apple)
![https://img.shields.io/github/issues-raw/ssbarbee/iap-apple](https://img.shields.io/github/issues-raw/ssbarbee/iap-apple)
![https://img.shields.io/npm/dw/iap-apple](https://img.shields.io/npm/dw/iap-apple)

Integration of Apple's **validation service** for App Store Receipts, written in TypeScript, available for Node.js environments.

A Node.js module for in-app purchase (in-app billing) and subscription validation for Apple.

## Requirements

- **Node.js 22+** (uses native `fetch`, zero runtime dependencies)

## Overview

Server-side validation of [App Store Receipts](https://developer.apple.com/documentation/appstorereceipts) by communicating with Apple's verifyReceipt endpoints.

## Installation

### pnpm

```bash
pnpm add iap-apple
```

### npm

```bash
npm install iap-apple
```

### yarn

```bash
yarn add iap-apple
```

## API Documentation

### verify

Validates a receipt against Apple's verifyReceipt endpoint. Attempts production first, falls back to sandbox if needed.

```typescript
import { verify, IAPAppleError, IVerifyReceiptResponseBody } from 'iap-apple';

async function verifyAppleReceipt(receipt: string) {
  try {
    const verifyReceiptResponse = await verify(receipt, {
      // Required: Your app's shared secret (hexadecimal string)
      // https://help.apple.com/app-store-connect/#/devf341c0f01
      appSharedSecret: 'your-shared-secret',

      // Optional: Exclude old transactions (default: false)
      appleExcludeOldTransactions: false,

      // Optional: Force sandbox-only validation (default: false)
      test: false,

      // Optional: Logger for debugging (default: null)
      logger: console,
    });
    console.log('verifyReceiptResponse', verifyReceiptResponse);
  } catch (error) {
    const iapAppleError = error as IAPAppleError;
    console.error('Error:', iapAppleError.rejectionMessage);
    console.error('Details:', iapAppleError.data);
  }
}
```

### isVerifiedReceipt

Checks if the response from `verify` indicates a successful validation.

```typescript
import { verify, isVerifiedReceipt, IIAPAppleConfig } from 'iap-apple';

async function checkReceipt(receipt: string, config: IIAPAppleConfig) {
  try {
    const response = await verify(receipt, config);
    if (isVerifiedReceipt(response)) {
      console.log('Receipt is valid');
    }
  } catch (error) {
    console.error('Validation failed:', (error as IAPAppleError).rejectionMessage);
  }
}
```

### getPurchasedItems

Extracts purchased items from the validated receipt, sorted by purchase date (newest first), deduplicated by `original_transaction_id`.

```typescript
import { verify, getPurchasedItems, IIAPAppleConfig } from 'iap-apple';

async function getLatestPurchase(receipt: string, config: IIAPAppleConfig) {
  try {
    const response = await verify(receipt, config);
    const purchasedItems = getPurchasedItems(response);
    const latestPurchase = purchasedItems[0];
    console.log('Latest purchase:', latestPurchase);
  } catch (error) {
    console.error('Error:', (error as IAPAppleError).rejectionMessage);
  }
}
```

### isPurchasedItemCanceled

Checks if a purchased item has been canceled.

```typescript
import { verify, getPurchasedItems, isPurchasedItemCanceled, IIAPAppleConfig } from 'iap-apple';

async function checkCancellation(receipt: string, config: IIAPAppleConfig) {
  try {
    const response = await verify(receipt, config);
    const purchasedItems = getPurchasedItems(response);
    const latestPurchase = purchasedItems[0];
    if (isPurchasedItemCanceled(latestPurchase)) {
      console.log('Purchase was canceled');
    }
  } catch (error) {
    console.error('Error:', (error as IAPAppleError).rejectionMessage);
  }
}
```

### isPurchasedItemExpired

Checks if a purchased item has expired (canceled or past expiration date).

```typescript
import { verify, getPurchasedItems, isPurchasedItemExpired, IIAPAppleConfig } from 'iap-apple';

async function checkExpiration(receipt: string, config: IIAPAppleConfig) {
  try {
    const response = await verify(receipt, config);
    const purchasedItems = getPurchasedItems(response);
    const latestPurchase = purchasedItems[0];
    if (isPurchasedItemExpired(latestPurchase)) {
      console.log('Purchase has expired');
    }
  } catch (error) {
    console.error('Error:', (error as IAPAppleError).rejectionMessage);
  }
}
```

## Types

### PurchasedItem

```typescript
interface PurchasedItem {
  bundleId: string;
  appItemId: string;
  originalTransactionId?: string;
  transactionId: string;
  productId: string;
  originalPurchaseDateMS?: number;
  expirationDateMS?: number;
  purchaseDateMS: number;
  isTrialPeriod: boolean;
  cancellationDateMS?: number;
  quantity: number;
}
```

### IIAPAppleConfig

```typescript
interface IIAPAppleConfig {
  appSharedSecret: string;
  appleExcludeOldTransactions?: boolean;
  test?: boolean;
  logger?: ILogger | null;
}
```

## License

ISC
