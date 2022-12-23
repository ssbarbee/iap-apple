| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ----------------------- | ------------------------- | ----------------- |
| ![Statements](https://img.shields.io/badge/statements-74.63%25-red.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-51.3%25-red.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-73.68%25-red.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-72.44%25-red.svg?style=flat) |

# iap-apple
📦🚀 Integration of Apples  **validation service** for App Store Receipts, written in Typescript, available for NodeJS environments.

A NodeJS module for in-app purchase (in-app billing) and subscription for Apple.

## Overview

Create a Typescript package for validation of [App Store Receipts](https://developer.apple.com/documentation/appstorereceipts).  
This package is meant to be used server side to validate receipts from the App Store by talking to Apples servers.

## Installation

### npm

```npm install iap-apple```

### yarn

```yarn add iap-apple```

## API documentation

### verify

API used to verify receipt data received during an App Store purchase.
Requires **appSharedSecret** to be passed as part of the configuration.
See example for more details.

```typescript

import { verify, IAPAppleError, IVerifyReceiptResponseBody } from 'iap-apple';

async function verifyAppleReceipt(receipt: string) {
    try {
        const verifyReceiptResponse = await verify(receipt, { 
            /*
              Your app's shared secret, which is a hexadecimal string. For more information about the shared secret.
              https://help.apple.com/app-store-connect/#/devf341c0f01
            */
            appSharedSecret, 
            /*
              To exclude old transaction, set this to true. 
              Default is false.
            */
            excludeOldTransactions: false,
            /*
              Force validation against Apple Sandbox only.
              In effect this means that the validation against Apple Production endpoint won't be used.
              Default is false.
            */
            test: false,
            /* 
              Optional can be omitted, pass logger object if you want to debug.
              Default is null object.
            */
            logger: console,
        });
        console.log('verifyReceiptResponse', verifyReceiptResponse);
    } catch(error) {
        const iapAppleError = error as IAPAppleError;
        const rejectionMessage: string = error.rejectionMessage;
        const errorData: IVerifyReceiptResponseBody | null = error.data;
        console.error('Error happened', rejectionMessage);
        console.error('Details', errorData);
    }
}
```

### isVerifiedReceipt

API used to verify if response returned by `verify` is verified.
Requires the output of `verify` to be passed.
See example for more details.

```typescript

import { verify, isVerifiedReceipt, IIAPAppleConfig } from 'iap-apple';

async function isVerifiedAppleReceipt(receipt: string, config: IIAPAppleConfig) {
    try {
        const verifyReceiptResponse = await verify(receipt, config);
        const isVerifiedReceipt = isVerifiedReceipt(verifyReceiptResponse);
    } catch(error) {
        const iapAppleError = error as IAPAppleError;
        const rejectionMessage: string = error.rejectionMessage;
        const errorData: IVerifyReceiptResponseBody | null = error.data;
        console.error('Error happened', rejectionMessage);
        console.error('Details', errorData);
    }
}
```

### getPurchasedItems

API used to get an array of PurchasedItem objects from the Apple App Store response,
sort by their purchase date descending.
Usually what we are interested in is the first item of the purchase.
Requires the output of `verify` to be passed.
See example for more details.

```typescript

import { verify, getPurchasedItems, IIAPAppleConfig } from 'iap-apple';

async function isVerifiedAppleReceipt(receipt: string, config: IIAPAppleConfig) {
    try {
        const verifyReceiptResponse = await verify(receipt, config);
        const purchasedItems = getPurchasedItems(verifyReceiptResponse);
        const latestPurchase = purchasedItems[0];
    } catch(error) {
        const iapAppleError = error as IAPAppleError;
        const rejectionMessage: string = error.rejectionMessage;
        const errorData: IVerifyReceiptResponseBody | null = error.data;
        console.error('Error happened', rejectionMessage);
        console.error('Details', errorData);
    }
}
```

### isPurchasedItemCanceled

API used to check if a purchased item is canceled.
Requires the output of `getPurchasedItems` to be passed.
See example for more details.

```typescript

import { verify, getPurchasedItems, isPurchasedItemCanceled, IIAPAppleConfig } from 'iap-apple';

async function isVerifiedAppleReceipt(receipt: string, config: IIAPAppleConfig) {
    try {
        const verifyReceiptResponse = await verify(receipt, config);
        const purchasedItems = getPurchasedItems(verifyReceiptResponse);
        const latestPurchase = purchasedItems[0];
        const isCanceled = isPurchasedItemCanceled(latestPurchase);
    } catch(error) {
        const iapAppleError = error as IAPAppleError;
        const rejectionMessage: string = error.rejectionMessage;
        const errorData: IVerifyReceiptResponseBody | null = error.data;
        console.error('Error happened', rejectionMessage);
        console.error('Details', errorData);
    }
}
```


### isPurchasedItemExpired

API used to check if a purchased item is expired.
Requires the output of `getPurchasedItems` to be passed.
See example for more details.

```typescript

import { verify, getPurchasedItems, isPurchasedItemExpired, IIAPAppleConfig } from 'iap-apple';

async function isVerifiedAppleReceipt(receipt: string, config: IIAPAppleConfig) {
    try {
        const verifyReceiptResponse = await verify(receipt, config);
        const purchasedItems = getPurchasedItems(verifyReceiptResponse);
        const latestPurchase = purchasedItems[0];
        const isExpired = isPurchasedItemExpired(latestPurchase);
    } catch(error) {
        const iapAppleError = error as IAPAppleError;
        const rejectionMessage: string = error.rejectionMessage;
        const errorData: IVerifyReceiptResponseBody | null = error.data;
        console.error('Error happened', rejectionMessage);
        console.error('Details', errorData);
    }
}
```