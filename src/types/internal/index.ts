/*
    https://developer.apple.com/documentation/appstorereceipts/responsebody/pending_renewal_info
 */
export interface IPendingRenewalInfo {
  /*
        Auto Renew Product ID
        The current renewal preference for the auto-renewable subscription.
        The value for this key corresponds to the productIdentifier property of the product that the customer's subscription renews.
     */
  auto_renew_product_id: string;
  /*
        Auto Renew Status
        The current renewal status for the auto-renewable subscription.
        "1" - The subscription will renew at the end of the current subscription period.
        "0" - The customer has turned off automatic renewal for the subscription.
     */
  auto_renew_status: '0' | '1';
  /*
        Original Transaction ID
        The transaction identifier of the original purchase.
     */
  original_transaction_id: string;
  /*
        Product ID
        The product identifier of the product that will renew at the end of the current subscription period.
     */
  product_id: string;
  /*
        Expiration Intent
        The reason a subscription expired.
        "1" - Customer canceled their subscription.
        "2" - Billing error; for example, the customer's payment information was no longer valid.
        "3" - Customer did not agree to a recent price increase.
        "4" - Product was not available for purchase at the time of renewal.
        "5" - Unknown error.
     */
  expiration_intent?: '1' | '2' | '3' | '4' | '5';
  /*
        Grace Period Expires Date
        The time at which the grace period for subscription renewals expires, in UNIX epoch time format, in milliseconds.
        This key is only present for apps that have Billing Grace Period enabled and when the user experiences a billing error at the time of renewal.
     */
  grace_period_expires_date_ms?: string;
  /*
        Is In Billing Retry Period
        A flag that indicates Apple is attempting to renew an expired subscription automatically.
        "1" - The App Store is attempting to renew the subscription.
        "0" - The App Store has stopped attempting to renew the subscription.
     */
  is_in_billing_retry_period?: '0' | '1';
  /*
        Offer Code Reference Name
        The reference name of a subscription offer that you configured in App Store Connect.
        This field is present when a customer redeemed a subscription offer code.
     */
  offer_code_ref_name?: string;
  /*
        Price Consent Status
        The price consent status for a subscription price increase.
        "1" - Customer has agreed to the price increase.
        "0" - Customer has not yet responded to the price increase.
     */
  price_consent_status?: '0' | '1';
  /*
        Promotional Offer ID
        The identifier of the promotional offer for an auto-renewable subscription that the user redeemed.
     */
  promotional_offer_id?: string;
}

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
  /*
        Web Order Line Item ID
        A unique identifier for purchase events across devices, including subscription-renewal events.
        This value is the primary key for identifying subscription purchases.
     */
  web_order_line_item_id?: string;
  /*
        Introductory Price Period
        For an auto-renewable subscription, whether or not it is in the introductory price period.
        This key is only present for auto-renewable subscription receipts.
        The value for this key is "true" if the customer's subscription is currently in an introductory price period, or "false" if not.
     */
  is_in_intro_offer_period?: string;
  /*
        Promotional Offer ID
        The identifier of the promotional offer for an auto-renewable subscription that the user redeemed.
        This field is present only if the user redeemed a promotional offer.
     */
  promotional_offer_id?: string;
  /*
        Offer Code Reference Name
        The reference name of the offer code that the user redeemed.
        Present only if the user redeemed an offer code.
     */
  offer_code_ref_name?: string;
  /*
        In-App Ownership Type
        The relationship of the user with the family-shared purchase to which they have access.
        Possible values: FAMILY_SHARED, PURCHASED
     */
  in_app_ownership_type?: 'FAMILY_SHARED' | 'PURCHASED';
}
