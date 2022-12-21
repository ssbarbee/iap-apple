import { IIAPAppleConfig, IReceiptValidationResponseBody, PurchasedItem } from '../../types';
import { getPurchaseItem, validateReceipt } from '../internal';
import { PROD_PATH, RECEIPT_STATUS_ENUM, SANDBOX_PATH, STATUS_TO_MESSAGE_MAP } from '../../constants';

export async function validate(receipt: string, config: IIAPAppleConfig): Promise<IReceiptValidationResponseBody> {
  const logger = config.logger;

  return new Promise(async (resolve, reject) => {
    let validatedData: IReceiptValidationResponseBody | null = null;
    try {
      if (!config.test) {
        validatedData = await validateReceipt({
          logger: logger,
          validationEndpoint: PROD_PATH,
          receipt,
          password: config.applePassword,
          excludeOldTransactions: Boolean(config.appleExcludeOldTransactions),
        });
      }

      if (!validatedData) {
        validatedData = await validateReceipt({
          logger: logger,
          validationEndpoint: SANDBOX_PATH,
          receipt,
          password: config.applePassword,
          excludeOldTransactions: Boolean(config.appleExcludeOldTransactions),
        });
      }
      if (!validatedData) {
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

    if (validatedData.status === RECEIPT_STATUS_ENUM.SUCCESS) {
      if (validatedData.receipt?.in_app && validatedData.receipt?.in_app?.length === 0) {
        /*
                    Detected valid receipt,
                    but the receipt bought nothing
                    probably hacked: https://forums.developer.apple.com/thread/8954
                    https://developer.apple.com/library/mac/technotes/tn2413/_index.html#//apple_ref/doc/uid/DTS40016228-CH1-RECEIPT-HOW_DO_I_USE_THE_CANCELLATION_DATE_FIELD_
                */
        reject({
          rejectionMessage: 'Detected valid receipt, however purchase list is empty',
          data: validatedData,
        });
      }
      // validated successfully
      resolve(validatedData);
      return;
    }

    // failed to validate reject with apple message
    reject({
      rejectionMessage: STATUS_TO_MESSAGE_MAP[validatedData.status],
      data: validatedData,
    });
  });
}

export const isValidated = function (response: IReceiptValidationResponseBody): boolean {
  return response && response.status === RECEIPT_STATUS_ENUM.SUCCESS;
};

export const isExpired = function (purchasedItem: PurchasedItem): boolean {
  if (!purchasedItem || !purchasedItem.transactionId) {
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
  if (Date.now() - purchasedItem.expirationDateMS >= 0) {
    return true;
  }
  // has not expired yet
  return false;
};

export const isCanceled = function (purchasedItem: PurchasedItem): boolean {
  if (!purchasedItem || !purchasedItem.transactionId) {
    throw new Error('Detected invalid purchased item! Make sure object is defined and it has transaction id.');
  }
  return Boolean(purchasedItem.cancellationDateMS);
};

export const getPurchaseData = function (purchase?: IReceiptValidationResponseBody): PurchasedItem[] {
  if (!purchase || !purchase.receipt) {
    return [];
  }

  const data: PurchasedItem[] = [];
  let purchases = purchase.receipt.in_app || [];
  const lri = purchase.latest_receipt_info || purchase.receipt.latest_receipt_info;
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

    data.push(getPurchaseItem(item, purchase));
    transactionIds[tid] = true;
  }
  return data;
};
