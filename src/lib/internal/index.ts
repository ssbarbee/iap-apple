import { IAPAppleError, ILogger, IReceiptInAppItem, IVerifyReceiptResponseBody, PurchasedItem } from '../../types';
import { RECEIPT_STATUS_ENUM, STATUS_TO_MESSAGE_MAP } from '../../constants';
import * as request from 'superagent';

function prefixMessage(message: string) {
  return `[iap-apple] ${message}`;
}

export function isExpiredReceipt(responseData: IVerifyReceiptResponseBody) {
  const date = Math.max(
    ...(responseData.latest_receipt_info || [])
      .filter((lri) => lri.expires_date_ms)
      .map((lri) => parseInt(lri.expires_date_ms!, 10)),
  );
  if (date) {
    return date > Date.now().valueOf();
  }
  // old receipt
  return false;
}

async function verifyReceiptApple(
  url: string,
  content: {
    'receipt-data': string;
    password: string | undefined;
    'exclude-old-transactions': boolean;
  },
): Promise<IVerifyReceiptResponseBody> {
  return new Promise((resolve, reject) => {
    try {
      request
        .post(url)
        .set('Content-type', 'application/json')
        .send(JSON.stringify(content))
        .end((error, response) => {
          if (error || response.status !== 200) {
            reject(error);
            return;
          }
          resolve(response.body);
        });
    } catch (err) {
      reject(err);
    }
  });
}

export function getPurchaseItem(item: IReceiptInAppItem, purchase: IVerifyReceiptResponseBody): PurchasedItem {
  return {
    quantity: parseInt(item.quantity, 10),
    productId: item.product_id,
    transactionId: item.transaction_id,
    originalTransactionId: item.original_transaction_id,
    bundleId: purchase.receipt.bundle_id,
    appItemId: item.app_item_id,
    originalPurchaseDateMS: parseInt(item.original_purchase_date_ms, 10),
    purchaseDateMS: parseInt(item.purchase_date_ms, 10),
    cancellationDateMS: item.cancellation_date_ms ? parseInt(item.cancellation_date_ms, 10) : undefined,
    isTrialPeriod: item.is_trial_period === 'true',
    expirationDateMS: item.expires_date_ms ? parseInt(item.expires_date_ms, 10) : undefined,
  };
}

export const verifyReceipt = async function ({
  logger,
  validationEndpoint,
  receiptData,
  appSharedSecret,
  excludeOldTransactions,
}: {
  logger?: ILogger | null;
  validationEndpoint: string;
  receiptData: string;
  appSharedSecret: string;
  excludeOldTransactions: boolean;
}): Promise<IVerifyReceiptResponseBody | null> {
  return new Promise(async (resolve, reject) => {
    const content = {
      'receipt-data': receiptData,
      password: appSharedSecret,
      'exclude-old-transactions': excludeOldTransactions,
    };

    logger?.log(prefixMessage(`Validating against: ${validationEndpoint} endpoint`));
    logger?.log(prefixMessage(`Validation data: ${JSON.stringify(content, null, 2)}`));

    try {
      const data = await verifyReceiptApple(validationEndpoint, content);
      logger?.log(prefixMessage(`Endpoint ${validationEndpoint} response: ${JSON.stringify(data, null, 2)}`));
      // apple responded with error
      if (
        data.status !== RECEIPT_STATUS_ENUM.SUCCESS &&
        data.status !== RECEIPT_STATUS_ENUM.TEST_ENV_RECEIPT_DETECTED &&
        data.status !== RECEIPT_STATUS_ENUM.DATA_MALFORMED
      ) {
        if (data.status === RECEIPT_STATUS_ENUM.SUBSCRIPTION_EXPIRED && !isExpiredReceipt(data)) {
          /*
            detected valid subscription receipt,
            however it was cancelled, and it has not been expired
            status code is 21006 for both expired receipt and cancelled receipt...
          */
          logger?.log(prefixMessage('Valid receipt, but has been cancelled (not expired yet)'));
          // force status to be SUCCESS
          resolve({
            ...data,
            status: RECEIPT_STATUS_ENUM.SUCCESS,
          });
          return;
        }
        logger?.error(prefixMessage(`Endpoint ${validationEndpoint} failed: ${JSON.stringify(data, null, 2)}`));
        reject({
          rejectionMessage: STATUS_TO_MESSAGE_MAP[data.status] || 'Unknown',
          data,
        } as IAPAppleError);
        return;
      }
      // try another environment...
      if (data.status === RECEIPT_STATUS_ENUM.TEST_ENV_RECEIPT_DETECTED) {
        resolve(null);
        return;
      }
      if (data.status === RECEIPT_STATUS_ENUM.DATA_MALFORMED) {
        reject({
          rejectionMessage: STATUS_TO_MESSAGE_MAP[data.status] || 'Unknown',
          data,
        } as IAPAppleError);
        return;
      }
      // receipt validated
      logger?.log(prefixMessage(`Validation successful: ${JSON.stringify(data, null, 2)}`));
      resolve(data);
    } catch (error) {
      logger?.error(prefixMessage(`Endpoint ${validationEndpoint} failed: ${error}`));
      reject({
        rejectionMessage: (error as Error)?.message,
        data: null,
      } as IAPAppleError);
      reject(error);
    }
  });
};
