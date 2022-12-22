import { IReceiptInAppItem } from '../../types/internal';
import { RECEIPT_STATUS_ENUM } from '../../constants';

export interface ILogger {
  log: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
}

export interface IIAPAppleConfig {
  /*
        if you want to exclude old transaction, set this to true. Default is false
     */
  appleExcludeOldTransactions?: boolean | undefined;
  /*
        this comes from iTunes Connect (You need this to validate subscriptions)
     */
  applePassword?: string | undefined;
  /*
        force Sandbox validation only
     */
  test?: boolean | undefined;
  /*
        Logger object used for debugging purposes
     */
  logger?: ILogger | null;
}

export interface PurchasedItem {
  bundleId: string;
  appItemId: string;
  originalTransactionId?: string;
  transactionId: string;
  productId: string;
  originalPurchaseDate?: number;
  expirationDateMS?: number;
  purchaseDateMS: number;
  isTrialPeriod: boolean;
  cancellationDateMS?: number;
  quantity: number;
}

export interface IAPAppleError {
  rejectionMessage: string;
  data?: IReceiptValidationResponseBody | null;
}

/*
    https://developer.apple.com/documentation/storekit/original_api_for_in-app_purchase/validating_receipts_with_the_app_store#//apple_ref/doc/uid/TP40010573-CH104-SW1
    https://developer.apple.com/documentation/appstorereceipts/responsebody/
*/
export interface IReceiptValidationResponseBody {
  /*
          Either 0 if the receipt is valid, or a status code if there is an error.
          The status code reflects the status of the app receipt as a whole. See status for possible status codes and descriptions.
       */
  status: RECEIPT_STATUS_ENUM;
  /*
          The environment for which the receipt was generated.
          Possible values: Sandbox, Production
       */
  environment: 'Sandbox' | 'Production';
  /*
          A JSON representation of the receipt that was sent for verification.
       */
  receipt: IReceipt;
  /*
          The latest Base64 encoded app receipt. Only returned for receipts that contain auto-renewable subscriptions.
       */
  latest_receipt: string;
  /*
          An array that contains all in-app purchase transactions. This excludes transactions for consumable products that have been marked as finished by your app. Only returned for receipts that contain auto-renewable subscriptions.
       */
  latest_receipt_info: IReceiptInAppItem[];
  /*
          An indicator that an error occurred during the request.
          A value of 1 indicates a temporary issue; retry validation for this receipt at a later time.
          A value of 0 indicates an unresolvable issue; do not retry validation for this receipt. Only applicable to status codes 21100-21199.
       */
  'is-retryable': boolean;
}

/*
    https://developer.apple.com/documentation/appstorereceipts/responsebody/receipt
    https://developer.apple.com/library/archive/releasenotes/General/ValidateAppStoreReceipt/Chapters/ReceiptFields.html#//apple_ref/doc/uid/TP40010573-CH106-SW1
 */
interface IReceipt {
  /*
          The bundle identifier for the app to which the receipt belongs.
          You provide this string on App Store Connect.
          This corresponds to the value of CFBundleIdentifier in the Info.plist file of the app.
       */
  bundle_id: string;
  /*
          The app’s version number.
          The app's version number corresponds to the value of CFBundleVersion (in iOS) or CFBundleShortVersionString (in macOS) in the Info.plist.
          In production, this value is the current version of the app on the device based on the receipt_creation_date_ms. In the sandbox, the value is always "1.0".
       */
  application_version: string;
  /*
          An array that contains the in-app purchase receipt fields for all in-app purchase transactions.
       */
  in_app: IReceiptInAppItem[];
  /*
          An array that contains the in-app purchase receipt fields for all in-app purchase transactions.
       */
  latest_receipt_info: IReceiptInAppItem[];
  /*
          The version of the app that the user originally purchased. This value does not change, and corresponds to the value of CFBundleVersion (in iOS) or CFBundleShortVersionString (in macOS) in the Info.plist file of the original purchase. In the sandbox environment, the value is always "1.0".
       */
  original_application_version: string;
  /*
          The time the App Store generated the receipt, in UNIX epoch time format, in milliseconds. Use this time format for processing dates. This value does not change.
       */
  receipt_creation_date_ms: string;
  /*
          The time the receipt expires for apps purchased through the Volume Purchase Program, in UNIX epoch time format, in milliseconds. If this key is not present for apps purchased through the Volume Purchase Program, the receipt does not expire. Use this time format for processing dates.
       */
  expiration_date_ms: string;
  /*
          The time of the original app purchase, in UNIX epoch time format, in milliseconds. Use this time format for processing dates.
       */
  original_purchase_date: string;
  /*
          Generated by App Store Connect and used by the App Store to uniquely identify the app purchased. Apps are assigned this identifier only in production. Treat this value as a 64-bit long integer.
       */
  app_item_id: string;
  /*
          An arbitrary number that identifies a revision of your app. In the sandbox, this key's value is “0”.
       */
  version_external_identifier: string;
  /*
          Subscription Expiration Date
          The expiration date for the subscription, expressed as the number of milliseconds since January 1, 1970, 00:00:00 GMT.
          This key is only present for auto-renewable subscription receipts. Use this value to identify the date when the subscription will renew or expire, to determine if a customer should have access to content or service. After validating the latest receipt, if the subscription expiration date for the latest renewal transaction is a past date, it is safe to assume that the subscription has expired.
      */
  expires_date_ms?: string;
}
