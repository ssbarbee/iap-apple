import { IIAPAppleConfig, IVerifyReceiptResponseBody, PurchasedItem } from '../../types';
import { getPurchaseItem, verifyReceipt } from '../internal';
import { PROD_PATH, RECEIPT_STATUS_ENUM, SANDBOX_PATH, STATUS_TO_MESSAGE_MAP } from '../../constants';

/**
 * Validates an Apple App Store receipt against Apple's verifyReceipt endpoint.
 * Attempts production endpoint first, falls back to sandbox if needed.
 *
 * @param receipt - Base64-encoded receipt data from the App Store
 * @param config - Configuration including shared secret and optional settings
 * @returns Validated receipt response from Apple
 * @throws {IAPAppleError} When validation fails or receipt is invalid
 */
export async function verify(receipt: string, config: IIAPAppleConfig): Promise<IVerifyReceiptResponseBody> {
  const { appleExcludeOldTransactions, logger, test, appSharedSecret } = config;

  return new Promise(async (resolve, reject) => {
    let verifyReceiptResponse: IVerifyReceiptResponseBody | null = null;
    try {
      if (!test) {
        verifyReceiptResponse = await verifyReceipt({
          logger: logger,
          validationEndpoint: PROD_PATH,
          receiptData: receipt,
          appSharedSecret,
          excludeOldTransactions: Boolean(appleExcludeOldTransactions),
        });
      }

      if (!verifyReceiptResponse) {
        verifyReceiptResponse = await verifyReceipt({
          logger: logger,
          validationEndpoint: SANDBOX_PATH,
          receiptData: receipt,
          appSharedSecret,
          excludeOldTransactions: Boolean(appleExcludeOldTransactions),
        });
      }
      if (!verifyReceiptResponse) {
        reject({
          rejectionMessage: 'Unable to validate receipt using appstore endpoints.',
          data: null,
        });
        return;
      }
    } catch (err) {
      reject(err);
      return;
    }

    if (verifyReceiptResponse.status === RECEIPT_STATUS_ENUM.SUCCESS) {
      if (verifyReceiptResponse.receipt?.in_app && verifyReceiptResponse.receipt?.in_app?.length === 0) {
        /*
          Detected valid receipt, but the receipt bought nothing.
          Possibly hacked: https://forums.developer.apple.com/thread/8954
          https://developer.apple.com/library/mac/technotes/tn2413/_index.html#//apple_ref/doc/uid/DTS40016228-CH1-RECEIPT-HOW_DO_I_USE_THE_CANCELLATION_DATE_FIELD_
        */
        reject({
          rejectionMessage: 'Detected valid receipt, however purchase list is empty',
          data: verifyReceiptResponse,
        });
      }
      resolve(verifyReceiptResponse);
      return;
    }

    reject({
      rejectionMessage: STATUS_TO_MESSAGE_MAP[verifyReceiptResponse.status],
      data: verifyReceiptResponse,
    });
  });
}

/**
 * Checks whether the receipt validation was successful.
 *
 * @param verifyReceiptResponse - Response from Apple's verifyReceipt endpoint
 * @returns True if the receipt status indicates success
 */
export const isVerifiedReceipt = function (verifyReceiptResponse: IVerifyReceiptResponseBody | null): boolean {
  return verifyReceiptResponse?.status === RECEIPT_STATUS_ENUM.SUCCESS;
};

/**
 * Determines if a purchased item has expired (cancelled or past expiration date).
 *
 * @param purchasedItem - The purchased item to check
 * @returns True if the item has been cancelled or its expiration date has passed
 * @throws {Error} If purchasedItem is invalid or missing transactionId
 */
export const isPurchasedItemExpired = function (purchasedItem: PurchasedItem | null): boolean {
  if (!purchasedItem?.transactionId) {
    throw new Error('Detected invalid purchased item! Make sure object is defined and it has transaction id.');
  }

  if (purchasedItem.cancellationDateMS) {
    return true;
  }

  if (!purchasedItem.expirationDateMS) {
    return false;
  }

  return Date.now().valueOf() - purchasedItem.expirationDateMS >= 0;
};

/**
 * Checks if a purchased item has been cancelled.
 *
 * @param purchasedItem - The purchased item to check
 * @returns True if the item has a cancellation date
 * @throws {Error} If purchasedItem is invalid or missing transactionId
 */
export const isPurchasedItemCanceled = function (purchasedItem: PurchasedItem): boolean {
  if (!purchasedItem?.transactionId) {
    throw new Error('Detected invalid purchased item! Make sure object is defined and it has transaction id.');
  }
  return Boolean(purchasedItem.cancellationDateMS);
};

/**
 * Extracts purchased items from a validated receipt response.
 * Combines in_app and latest_receipt_info, deduplicates by original_transaction_id,
 * and returns items sorted by purchase date (newest first).
 *
 * @param verifyReceiptResponse - Response from Apple's verifyReceipt endpoint
 * @returns Array of purchased items, deduplicated and sorted by purchase date descending
 */
export const getPurchasedItems = function (verifyReceiptResponse: IVerifyReceiptResponseBody | null): PurchasedItem[] {
  if (!verifyReceiptResponse?.receipt) {
    return [];
  }

  const data: PurchasedItem[] = [];
  let purchases = verifyReceiptResponse.receipt.in_app || [];
  const lri = verifyReceiptResponse.latest_receipt_info || verifyReceiptResponse.receipt.latest_receipt_info;
  if (Array.isArray(lri)) {
    purchases = purchases.concat(lri);
  }

  /*
    Sort purchases by purchase_date_ms DESC to ensure we keep the most recent
    transaction when deduplicating by original_transaction_id.
  */
  purchases.sort((a, b) => parseInt(b.purchase_date_ms, 10) - parseInt(a.purchase_date_ms, 10));

  const transactionIds: Record<string, boolean> = {};
  for (let i = 0; i < purchases.length; i++) {
    const item = purchases[i];
    const tid = item.original_transaction_id;
    if (transactionIds[tid]) {
      continue;
    }

    data.push(getPurchaseItem(item, verifyReceiptResponse));
    transactionIds[tid] = true;
  }
  return data;
};
