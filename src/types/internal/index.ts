/*
    https://developer.apple.com/documentation/appstorereceipts/responsebody/receipt/in_app
 */
export interface IReceiptInAppItem {
  /*
        Quantity
        The number of items purchased.
     */
  quantity: string;
  /*
       Product Identifier
       The product identifier of the item that was purchased.
       The subscription they have decided to take, as set in App Store Connect
    */
  product_id: string;
  /*
        Transaction Identifier
        The transaction identifier of the item that was purchased.
     */
  transaction_id: string;
  /*
        Original Transaction Identifier
        For a transaction that restores a previous transaction, the transaction identifier of the original transaction. Otherwise, identical to the transaction identifier.
    */
  original_transaction_id: string;
  /*
        Purchase Date
        The date and time that the item was purchased.
        Type is string, interpreted as an RFC 3339 date
     */
  purchase_date: string;
  /*
        Purchase Date expressed in milliseconds
        The date and time that the item was purchased.
        The expiration date for the subscription, expressed as the number of milliseconds since January 1, 1970, 00:00:00 GMT.
     */
  purchase_date_ms: string;
  /*
        Original Purchase Date
        For a transaction that restores a previous transaction, the date of the original transaction.
        Type is string, interpreted as an RFC 3339 date
     */
  original_purchase_date: string;
  /*
        Original Purchase Date  expressed in milliseconds
        For a transaction that restores a previous transaction, the date of the original transaction.
        The purchase date for the subscription, expressed as the number of milliseconds since January 1, 1970, 00:00:00 GMT.
     */
  original_purchase_date_ms: string;
  /*
        Subscription Expiration Date
        Type is string, interpreted as an RFC 3339 date
        This key is only present for auto-renewable subscription receipts. Use this value to identify the date when the subscription will renew or expire, to determine if a customer should have access to content or service. After validating the latest receipt, if the subscription expiration date for the latest renewal transaction is a past date, it is safe to assume that the subscription has expired.
    */
  expires_date?: string;
  /*
        Subscription Expiration Date
        The expiration date for the subscription, expressed as the number of milliseconds since January 1, 1970, 00:00:00 GMT.
        This key is only present for auto-renewable subscription receipts. Use this value to identify the date when the subscription will renew or expire, to determine if a customer should have access to content or service. After validating the latest receipt, if the subscription expiration date for the latest renewal transaction is a past date, it is safe to assume that the subscription has expired.
    */
  expires_date_ms?: string;
  /*
        Subscription Expiration Intent
        For an expired subscription, the reason for the subscription expiration.
        "1" - Customer canceled their subscription.
        "2" - Billing error; for example customer’s payment information was no longer valid.
        "3" - Customer did not agree to a recent price increase.
        "4" - Product was not available for purchase at the time of renewal.
        "5" - Unknown error.
        This key is only present for a receipt containing an expired auto-renewable subscription. You can use this value to decide whether to display appropriate messaging in your app for customers to resubscribe.
     */
  expiration_intent?: '1' | '2' | '3' | '4' | '5';
  /*
        Subscription Trial Period
        For a subscription, whether it is in the free trial period.

        This key is only present for auto-renewable subscription receipts. The value for this key is "true" if the customer’s subscription is currently in the free trial period, or "false" if not.
     */
  is_trial_period: string;
  /*
        Cancellation Date
        For a transaction that was canceled by Apple customer support, the time and date of the cancellation. For an auto-renewable subscription plan that was upgraded, the time and date of the upgrade transaction.
        Type is string, interpreted as an RFC 3339 date
     */
  cancellation_date?: string;
  /*
        Cancellation Date
        For a transaction that was canceled by Apple customer support, the time and date of the cancellation. For an auto-renewable subscription plan that was upgraded, the time and date of the upgrade transaction.
        The cancel date for the subscription, expressed as the number of milliseconds since January 1, 1970, 00:00:00 GMT.
     */
  cancellation_date_ms?: string;
  /*
        Cancellation Reason
        For a transaction that was canceled, the reason for cancellation.

        "1" - Customer canceled their transaction due to an actual or perceived issue within your app.
        "0" - Transaction was canceled for another reason, for example, if the customer made the purchase accidentally.

        Use this value along with the cancellation date to identify possible issues in your app that may lead customers to contact Apple customer support.
     */
  cancellation_reason?: '0' | '1';
  /*
        App Item ID
        A string that the App Store uses to uniquely identify the application that created the transaction.
     */
  app_item_id: string;
}
