import { IReceiptValidationResponseBody } from '../../types/internal';

export interface ILogger {
    log: (message: string) => void,
    warn: (message: string) => void,
    error: (message: string) => void,
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
    rejectionMessage: string,
    data?: IReceiptValidationResponseBody | null
}
