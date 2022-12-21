export enum RECEIPT_STATUS_ENUM {
  SUCCESS = 0,
  // 'The receipt is valid, but purchased nothing.'
  VALID_NO_PURCHASE = 2,
  // 'The App Store could not read the JSON object you provided.',
  CANNOT_READ_JSON = 21000,
  // 'The data in the receipt-data property was malformed.',
  DATA_MALFORMED = 21002,
  // 'The receipt could not be authenticated.',
  RECEIPT_NOT_AUTHENTICATED = 21003,
  // The shared secret you provided does not match the shared secret on file for your account.
  SHARED_SECRET_DOESNT_MATCH = 21004,
  // 'The receipt server is not currently available.',
  SERVER_NOT_AVAILABLE = 21005,
  // 'This receipt is valid but the subscription has expired.
  // When this status code is returned to your server, the receipt data is
  // also decoded and returned as part of the response.',
  SUBSCRIPTION_EXPIRED = 21006,
  // 'This receipt is a sandbox receipt, but it was sent to the production service for verification.'
  TEST_ENV_RECEIPT_DETECTED = 21007,
  // 'This receipt is a production receipt, but it was sent to the sandbox service for verification.'
  PRODUCTION_ENV_RECEIPT_DETECTED = 21008,
  // 'Internal data access error. Try again later'
  INTERNAL_DATA_ACCESS_ERROR = 21009,
  // 'The user account cannot be found or has been deleted'
  USER_ACCOUNT_DELETED = 21010,
}
