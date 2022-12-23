import { IIAPAppleConfig, IVerifyReceiptResponseBody, PurchasedItem } from '../../types';
import { getPurchaseItem, verifyReceipt } from '../internal';
import { PROD_PATH, RECEIPT_STATUS_ENUM, SANDBOX_PATH, STATUS_TO_MESSAGE_MAP } from '../../constants';

/**
 * It takes a receipt data and a config object, and returns a promise that resolves to a validated receipt object or
 * rejects with an error
 * @param {string} receipt - The receipt data.
 * @param {IIAPAppleConfig} config - IIAPAppleConfig
 * @returns a promise.
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
          Detected valid receipt,
          but the receipt bought nothing
          probably hacked: https://forums.developer.apple.com/thread/8954
          https://developer.apple.com/library/mac/technotes/tn2413/_index.html#//apple_ref/doc/uid/DTS40016228-CH1-RECEIPT-HOW_DO_I_USE_THE_CANCELLATION_DATE_FIELD_
        */
        reject({
          rejectionMessage: 'Detected valid receipt, however purchase list is empty',
          data: verifyReceiptResponse,
        });
      }
      // validated successfully
      resolve(verifyReceiptResponse);
      return;
    }

    // failed to validate reject with apple message
    reject({
      rejectionMessage: STATUS_TO_MESSAGE_MAP[verifyReceiptResponse.status],
      data: verifyReceiptResponse,
    });
  });
}

/**
 * It checks if the receipt is valid.
 * @param {IVerifyReceiptResponseBody | null} verifyReceiptResponse - IVerifyReceiptResponseBody | null
 * @returns A boolean
 */
export const isVerifiedReceipt = function (verifyReceiptResponse: IVerifyReceiptResponseBody | null): boolean {
  return verifyReceiptResponse?.status === RECEIPT_STATUS_ENUM.SUCCESS;
};

/**
 * If the purchased item has been cancelled or if the expiration date has passed, then it has expired
 * @param {PurchasedItem | null} purchasedItem - PurchasedItem | null
 * @returns A boolean
 */
export const isPurchasedItemExpired = function (purchasedItem: PurchasedItem | null): boolean {
  if (!purchasedItem?.transactionId) {
    throw new Error('Detected invalid purchased item! Make sure object is defined and it has transaction id.');
  }

  // it has been cancelled
  if (purchasedItem.cancellationDateMS) {
    return true;
  }

  // there is no expiration date with this item
  if (!purchasedItem.expirationDateMS) {
    return false;
  }
  // has expired
  if (Date.now().valueOf() - purchasedItem.expirationDateMS >= 0) {
    return true;
  }
  // has not expired yet
  return false;
};

/**
 * If the purchased item has a cancellation date, then it's canceled.
 * @param {PurchasedItem} purchasedItem - PurchasedItem - this is the purchased item object that you get from the
 * getPurchasedItems() method.
 * @returns A boolean value.
 */
export const isPurchasedItemCanceled = function (purchasedItem: PurchasedItem): boolean {
  if (!purchasedItem?.transactionId) {
    throw new Error('Detected invalid purchased item! Make sure object is defined and it has transaction id.');
  }
  return Boolean(purchasedItem.cancellationDateMS);
};

/**
 * It takes a response from the Apple App Store and returns an array of PurchasedItem objects sorted by their purchase date in descending order,
 * the latest purchase comes first.
 * @param {IVerifyReceiptResponseBody | null} verifyReceiptResponse - IVerifyReceiptResponseBody | null
 * @returns An array of PurchasedItem objects.
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
    we sort purchases by purchase_date_ms to make it easier
    to weed out duplicates (items with the same original_transaction_id)
    purchase_date_ms DESC
  */
  purchases.sort(function (a, b) {
    return parseInt(b.purchase_date_ms, 10) - parseInt(a.purchase_date_ms, 10);
  });

  const transactionIds: Record<string, boolean> = {};
  for (let i = 0; i < purchases.length; i++) {
    const item = purchases[i];
    const tid = item.original_transaction_id;
    // avoid duplicate
    if (transactionIds[tid]) {
      continue;
    }

    data.push(getPurchaseItem(item, verifyReceiptResponse));
    transactionIds[tid] = true;
  }
  return data;
};
