import { expect } from 'chai';
import { readFileSync } from 'fs-extra';
import nock from 'nock';
import {
  getPurchasedItems,
  isPurchasedItemCanceled,
  isPurchasedItemExpired,
  isVerifiedReceipt,
  PurchasedItem,
  RECEIPT_STATUS_ENUM,
  verify,
} from '../index';
import { join } from 'path';

const receiptPath = join(__dirname, './receipts/apple');

describe('iap-apple', function () {
  afterEach(() => {
    nock.cleanAll();
  });

  it('Can parse the validated subscription receipt with duplicates', async () => {
    const list = [
      {
        quantity: '1',
        product_id: 'basicmembership',
        transaction_id: '1000000381600687',
        original_transaction_id: '1000000381600687',
        purchase_date: '2018-03-08 19:58:55 Etc/GMT',
        purchase_date_ms: '1520539135000',
        purchase_date_pst: '2018-03-08 11:58:55 America/Los_Angeles',
        original_purchase_date: '2018-03-08 19:58:56 Etc/GMT',
        original_purchase_date_ms: '1520539136000',
        original_purchase_date_pst: '2018-03-08 11:58:56 America/Los_Angeles',
        expires_date: '2018-03-08 20:03:55 Etc/GMT',
        expires_date_ms: '1520539435000',
        expires_date_pst: '2018-03-08 12:03:55 America/Los_Angeles',
        web_order_line_item_id: '1000000038056225',
        is_trial_period: 'false',
        is_in_intro_offer_period: 'false',
      },
      {
        quantity: '1',
        product_id: 'basicmembership',
        transaction_id: '1000000381600903',
        original_transaction_id: '1000000381600687',
        purchase_date: '2018-03-08 20:03:55 Etc/GMT',
        purchase_date_ms: '1520539435000',
        purchase_date_pst: '2018-03-08 12:03:55 America/Los_Angeles',
        original_purchase_date: '2018-03-08 19:58:56 Etc/GMT',
        original_purchase_date_ms: '1520539136000',
        original_purchase_date_pst: '2018-03-08 11:58:56 America/Los_Angeles',
        expires_date: '2018-03-08 20:08:55 Etc/GMT',
        expires_date_ms: '1520539735000',
        expires_date_pst: '2018-03-08 12:08:55 America/Los_Angeles',
        web_order_line_item_id: '1000000038056226',
        is_trial_period: 'false',
        is_in_intro_offer_period: 'false',
      },
      {
        quantity: '1',
        product_id: 'basicmembership',
        transaction_id: '1000000381601336',
        original_transaction_id: '1000000381600687',
        purchase_date: '2018-03-08 20:09:15 Etc/GMT',
        purchase_date_ms: '1520539755000',
        purchase_date_pst: '2018-03-08 12:09:15 America/Los_Angeles',
        original_purchase_date: '2018-03-08 19:58:56 Etc/GMT',
        original_purchase_date_ms: '1520539136000',
        original_purchase_date_pst: '2018-03-08 11:58:56 America/Los_Angeles',
        expires_date: '2018-03-08 20:14:15 Etc/GMT',
        expires_date_ms: '1520540055000',
        expires_date_pst: '2018-03-08 12:14:15 America/Los_Angeles',
        web_order_line_item_id: '1000000038056264',
        is_trial_period: 'false',
        is_in_intro_offer_period: 'false',
      },
      {
        quantity: '1',
        product_id: 'basicmembership',
        transaction_id: '1000000381601740',
        original_transaction_id: '1000000381600687',
        purchase_date: '2018-03-08 20:14:30 Etc/GMT',
        purchase_date_ms: '1520540070000',
        purchase_date_pst: '2018-03-08 12:14:30 America/Los_Angeles',
        original_purchase_date: '2018-03-08 19:58:56 Etc/GMT',
        original_purchase_date_ms: '1520539136000',
        original_purchase_date_pst: '2018-03-08 11:58:56 America/Los_Angeles',
        expires_date: '2018-03-08 20:19:30 Etc/GMT',
        expires_date_ms: '1520540370000',
        expires_date_pst: '2018-03-08 12:19:30 America/Los_Angeles',
        web_order_line_item_id: '1000000038056312',
        is_trial_period: 'false',
        is_in_intro_offer_period: 'false',
      },
      {
        quantity: '1',
        product_id: 'basicmembership',
        transaction_id: '1000000381602052',
        original_transaction_id: '1000000381600687',
        purchase_date: '2018-03-08 20:19:30 Etc/GMT',
        purchase_date_ms: '1520540370000',
        purchase_date_pst: '2018-03-08 12:19:30 America/Los_Angeles',
        original_purchase_date: '2018-03-08 19:58:56 Etc/GMT',
        original_purchase_date_ms: '1520539136000',
        original_purchase_date_pst: '2018-03-08 11:58:56 America/Los_Angeles',
        expires_date: '2018-03-08 20:24:30 Etc/GMT',
        expires_date_ms: '1520540670000',
        expires_date_pst: '2018-03-08 12:24:30 America/Los_Angeles',
        web_order_line_item_id: '1000000038056364',
        is_trial_period: 'false',
        is_in_intro_offer_period: 'false',
      },
      {
        quantity: '1',
        product_id: 'basicmembership',
        transaction_id: '1000000381602343',
        original_transaction_id: '1000000381600687',
        purchase_date: '2018-03-08 20:24:30 Etc/GMT',
        purchase_date_ms: '1520540670000',
        purchase_date_pst: '2018-03-08 12:24:30 America/Los_Angeles',
        original_purchase_date: '2018-03-08 19:58:56 Etc/GMT',
        original_purchase_date_ms: '1520539136000',
        original_purchase_date_pst: '2018-03-08 11:58:56 America/Los_Angeles',
        expires_date: '2018-03-08 20:29:30 Etc/GMT',
        expires_date_ms: '1520540970000',
        expires_date_pst: '2018-03-08 12:29:30 America/Los_Angeles',
        web_order_line_item_id: '1000000038056406',
        is_trial_period: 'false',
        is_in_intro_offer_period: 'false',
      },
    ];
    const data = {
      receipt: {
        in_app: [],
        latest_receipt_info: list,
      },
    };
    const res = getPurchasedItems(data as any);
    expect(res.length).to.equal(1);
    expect(res[0].originalTransactionId).to.equal('1000000381600687');
    expect(res[0].purchaseDateMS).to.equal(1520540670000);
    expect(res[0].isTrialPeriod).to.equal(false);
  });

  it('Can verify apple in-app-purchase (mocked)', async () => {
    const receipt = readFileSync(receiptPath).toString();

    // Mock successful response from sandbox (after production returns 21007)
    const mockResponse = {
      status: 0,
      environment: 'Sandbox',
      receipt: {
        bundle_id: 'com.example.app',
        in_app: [
          {
            quantity: '1',
            product_id: 'com.example.subscription',
            transaction_id: '1000000461788817',
            original_transaction_id: '1000000461788817',
            purchase_date: '2012-04-30 15:05:55 Etc/GMT',
            purchase_date_ms: '1335798355868',
            original_purchase_date: '2012-04-30 15:05:55 Etc/GMT',
            original_purchase_date_ms: '1335798355868',
            is_trial_period: 'false',
            app_item_id: '521129812',
          },
        ],
      },
    };

    // Production returns 21007 (sandbox receipt sent to production)
    nock('https://buy.itunes.apple.com').post('/verifyReceipt').reply(200, { status: 21007 });

    // Sandbox returns success
    nock('https://sandbox.itunes.apple.com').post('/verifyReceipt').reply(200, mockResponse);

    const response = await verify(receipt, {
      appSharedSecret: 'fake-shared-secret',
    });

    expect(isVerifiedReceipt(response)).to.equal(true);
    const data = getPurchasedItems(response);
    for (let i = 0; i < data.length; i++) {
      expect(data[i].productId).not.to.equal(undefined);
      expect(data[i].purchaseDateMS).not.to.equal(undefined);
      expect(data[i].quantity).to.not.equal(undefined);
    }
  });

  it('Can NOT verify apple in-app-purchase with incorrect receipt w/ auto-service detection (mocked)', async () => {
    // Both production and sandbox return 21002 for malformed receipt
    nock('https://buy.itunes.apple.com').post('/verifyReceipt').reply(200, { status: 21002 });

    try {
      await verify('fake-receipt', {
        appSharedSecret: 'fake-shared-secret',
      });
      // Should not reach here
      expect.fail('Expected verification to throw');
    } catch (error) {
      expect(error).not.to.equal(undefined);
      expect(error).to.deep.equal({
        rejectionMessage: 'The data in the receipt-data property was malformed.',
        data: {
          status: 21002,
        },
      });
    }
  });

  it('Can detect a valid receipt that bought nothing (mocked)', async () => {
    const receipt =
      'MIISnwYJKoZIhvcNAQcCoIISkDCCEowCAQExCzAJBgUrDgMCGgUAMIICUAYJKoZIhvcNAQcBoIICQQSCAj0xggI5MAoCARQCAQEEAgwAMAsCAQ4CAQEEAwIBUjALAgEZAgEBBAMCAQMwDAIBCgIBAQQEFgI0KzANAgENAgEBBAUCAwE6EDAOAgEBAgEBBAYCBDyGdAUwDgIBCQIBAQQGAgRQMjM0MA4CAQsCAQEEBgIEBwahzzAOAgEQAgEBBAYCBDB3db4wDwIBAwIBAQQHDAUxLjEuMjAPAgETAgEBBAcMBTEuMS4yMBACAQ8CAQEECAIGGXrXariDMBQCAQACAQEEDAwKUHJvZHVjdGlvbjAYAgEEAgECBBC7FVpt';

    // Mock: Production returns 21007, then sandbox returns success with empty in_app
    nock('https://buy.itunes.apple.com').post('/verifyReceipt').reply(200, { status: 21007 });

    nock('https://sandbox.itunes.apple.com')
      .post('/verifyReceipt')
      .reply(200, {
        status: 0,
        environment: 'Sandbox',
        receipt: {
          bundle_id: 'com.mustafadur.Kargotakip',
          in_app: [],
        },
      });

    try {
      await verify(receipt, {
        appSharedSecret: 'fake-shared-secret',
      });
      expect.fail('Expected verification to throw');
    } catch (error) {
      expect(error).not.to.equal(undefined);
    }
  });

  it('Can parse both in_app and latest_receipt_info array with .getPurchaseData()', function () {
    const rec = {
      receipt: {
        in_app: [
          {
            quantity: '1',
            product_id: 'in_app.0',
            transaction_id: '210000259386802',
            original_transaction_id: '210000259386802',
            purchase_date: '2016-04-14 16:03:33 Etc/GMT',
            purchase_date_ms: '1460649813000',
            purchase_date_pst: '2016-04-14 09:03:33 America/Los_Angeles',
            original_purchase_date: '2016-04-14 16:03:34 Etc/GMT',
            original_purchase_date_ms: '1460649814000',
            original_purchase_date_pst: '2016-04-14 09:03:34 America/Los_Angeles',
            expires_date: '2016-05-14 16:03:33 Etc/GMT',
            expires_date_ms: '1463241813000',
            expires_date_pst: '2016-05-14 09:03:33 America/Los_Angeles',
            web_order_line_item_id: '210000038560504',
            is_trial_period: 'false',
          },
        ],
      },
      latest_receipt_info: [
        {
          quantity: '1',
          product_id: 'latest_receipt_info.0',
          transaction_id: '210000259386802',
          original_transaction_id: '210000259386802',
          purchase_date: '2016-04-14 16:03:33 Etc/GMT',
          purchase_date_ms: '1460649813982',
          purchase_date_pst: '2016-04-14 09:03:33 America/Los_Angeles',
          original_purchase_date: '2016-04-14 16:03:34 Etc/GMT',
          original_purchase_date_ms: '1460649814000',
          original_purchase_date_pst: '2016-04-14 09:03:34 America/Los_Angeles',
          expires_date: '2016-05-14 16:03:33 Etc/GMT',
          expires_date_ms: '1463241813982',
          expires_date_pst: '2016-05-14 09:03:33 America/Los_Angeles',
          web_order_line_item_id: '210000038560504',
          is_trial_period: 'false',
        },
        {
          quantity: '1',
          product_id: 'latest_receipt_info.1',
          transaction_id: '210000265773203',
          original_transaction_id: '210000259386802',
          purchase_date: '2016-05-14 16:03:33 Etc/GMT',
          purchase_date_ms: '1463241813000',
          purchase_date_pst: '2016-05-14 09:03:33 America/Los_Angeles',
          original_purchase_date: '2016-05-14 10:03:37 Etc/GMT',
          original_purchase_date_ms: '1463220217552',
          original_purchase_date_pst: '2016-05-14 03:03:37 America/Los_Angeles',
          expires_date: '2016-06-14 16:03:33 Etc/GMT',
          expires_date_ms: '1465920213000',
          expires_date_pst: '2016-06-14 09:03:33 America/Los_Angeles',
          web_order_line_item_id: '210000038560503',
          is_trial_period: 'false',
        },
      ],
    };

    const parsed = getPurchasedItems(rec as any);
    const res = ['in_app.0', 'latest_receipt_info.0', 'latest_receipt_info.1'];

    for (let i = 0; i < parsed.length; i++) {
      if (res.indexOf(parsed[i].productId) === -1) {
        console.error(parsed[i]);
        throw new Error('missing purchase data');
      }
    }
  });

  it('Can parse without latest_receipt_info array with .getPurchaseData()', function () {
    const rec = {
      receipt: {
        in_app: [
          {
            quantity: '1',
            product_id: 'in_app.0',
            transaction_id: '210000259386802',
            original_transaction_id: '210000259386802',
            purchase_date: '2016-04-14 16:03:33 Etc/GMT',
            purchase_date_ms: '1460649813000',
            purchase_date_pst: '2016-04-14 09:03:33 America/Los_Angeles',
            original_purchase_date: '2016-04-14 16:03:34 Etc/GMT',
            original_purchase_date_ms: '1460649814000',
            original_purchase_date_pst: '2016-04-14 09:03:34 America/Los_Angeles',
            expires_date: '2016-05-14 16:03:33 Etc/GMT',
            expires_date_ms: '1463241813000',
            expires_date_pst: '2016-05-14 09:03:33 America/Los_Angeles',
            web_order_line_item_id: '210000038560504',
            is_trial_period: 'false',
          },
        ],
      },
    };

    const parsed = getPurchasedItems(rec as any);
    const res = ['in_app.0'];
    for (let i = 0; i < parsed.length; i++) {
      if (res.indexOf(parsed[i].productId) === -1) {
        throw new Error('missing purchase data');
      }
    }
  });

  describe('isVerifiedReceipt', function () {
    it('returns true for successful status', function () {
      const response = { status: RECEIPT_STATUS_ENUM.SUCCESS } as any;
      expect(isVerifiedReceipt(response)).to.equal(true);
    });

    it('returns false for non-success status', function () {
      const response = { status: RECEIPT_STATUS_ENUM.DATA_MALFORMED } as any;
      expect(isVerifiedReceipt(response)).to.equal(false);
    });

    it('returns false for null input', function () {
      expect(isVerifiedReceipt(null)).to.equal(false);
    });

    it('returns false for undefined status', function () {
      const response = {} as any;
      expect(isVerifiedReceipt(response)).to.equal(false);
    });
  });

  describe('isPurchasedItemExpired', function () {
    const createPurchasedItem = (overrides: Partial<PurchasedItem> = {}): PurchasedItem => ({
      bundleId: 'com.example.app',
      appItemId: '123456',
      transactionId: 'txn_123',
      originalTransactionId: 'txn_123',
      productId: 'com.example.product',
      purchaseDateMS: Date.now() - 86400000,
      isTrialPeriod: false,
      quantity: 1,
      ...overrides,
    });

    it('throws error for null input', function () {
      expect(() => isPurchasedItemExpired(null)).to.throw(
        'Detected invalid purchased item! Make sure object is defined and it has transaction id.',
      );
    });

    it('throws error for item without transactionId', function () {
      const item = createPurchasedItem({ transactionId: '' });
      expect(() => isPurchasedItemExpired(item)).to.throw(
        'Detected invalid purchased item! Make sure object is defined and it has transaction id.',
      );
    });

    it('returns true for cancelled item', function () {
      const item = createPurchasedItem({ cancellationDateMS: Date.now() - 3600000 });
      expect(isPurchasedItemExpired(item)).to.equal(true);
    });

    it('returns false for item without expiration date', function () {
      const item = createPurchasedItem({ expirationDateMS: undefined });
      expect(isPurchasedItemExpired(item)).to.equal(false);
    });

    it('returns true for expired item', function () {
      const item = createPurchasedItem({ expirationDateMS: Date.now() - 86400000 });
      expect(isPurchasedItemExpired(item)).to.equal(true);
    });

    it('returns false for non-expired item', function () {
      const item = createPurchasedItem({ expirationDateMS: Date.now() + 86400000 });
      expect(isPurchasedItemExpired(item)).to.equal(false);
    });

    it('returns true for item expiring exactly now', function () {
      const item = createPurchasedItem({ expirationDateMS: Date.now() });
      expect(isPurchasedItemExpired(item)).to.equal(true);
    });
  });

  describe('isPurchasedItemCanceled', function () {
    const createPurchasedItem = (overrides: Partial<PurchasedItem> = {}): PurchasedItem => ({
      bundleId: 'com.example.app',
      appItemId: '123456',
      transactionId: 'txn_123',
      originalTransactionId: 'txn_123',
      productId: 'com.example.product',
      purchaseDateMS: Date.now() - 86400000,
      isTrialPeriod: false,
      quantity: 1,
      ...overrides,
    });

    it('throws error for null input', function () {
      expect(() => isPurchasedItemCanceled(null as any)).to.throw(
        'Detected invalid purchased item! Make sure object is defined and it has transaction id.',
      );
    });

    it('throws error for item without transactionId', function () {
      const item = createPurchasedItem({ transactionId: '' });
      expect(() => isPurchasedItemCanceled(item)).to.throw(
        'Detected invalid purchased item! Make sure object is defined and it has transaction id.',
      );
    });

    it('returns true for cancelled item', function () {
      const item = createPurchasedItem({ cancellationDateMS: Date.now() - 3600000 });
      expect(isPurchasedItemCanceled(item)).to.equal(true);
    });

    it('returns false for non-cancelled item', function () {
      const item = createPurchasedItem({ cancellationDateMS: undefined });
      expect(isPurchasedItemCanceled(item)).to.equal(false);
    });
  });

  describe('getPurchasedItems edge cases', function () {
    it('returns empty array for null input', function () {
      expect(getPurchasedItems(null)).to.deep.equal([]);
    });

    it('returns empty array for response without receipt', function () {
      const response = { status: 0 } as any;
      expect(getPurchasedItems(response)).to.deep.equal([]);
    });

    it('returns empty array for response with empty in_app and no latest_receipt_info', function () {
      const response = {
        status: 0,
        receipt: {
          bundle_id: 'com.example.app',
          in_app: [],
        },
      } as any;
      expect(getPurchasedItems(response)).to.deep.equal([]);
    });
  });

  describe('verify with test mode', function () {
    it('skips production endpoint when test: true', async function () {
      const receipt = readFileSync(receiptPath).toString();

      const mockResponse = {
        status: 0,
        environment: 'Sandbox',
        receipt: {
          bundle_id: 'com.example.app',
          in_app: [
            {
              quantity: '1',
              product_id: 'com.example.subscription',
              transaction_id: '1000000461788817',
              original_transaction_id: '1000000461788817',
              purchase_date: '2012-04-30 15:05:55 Etc/GMT',
              purchase_date_ms: '1335798355868',
              original_purchase_date: '2012-04-30 15:05:55 Etc/GMT',
              original_purchase_date_ms: '1335798355868',
              is_trial_period: 'false',
              app_item_id: '521129812',
            },
          ],
        },
      };

      // Only mock sandbox - production should NOT be called
      const sandboxScope = nock('https://sandbox.itunes.apple.com').post('/verifyReceipt').reply(200, mockResponse);

      const response = await verify(receipt, {
        appSharedSecret: 'fake-shared-secret',
        test: true,
      });

      expect(isVerifiedReceipt(response)).to.equal(true);
      expect(sandboxScope.isDone()).to.equal(true);
    });
  });

  describe('verify with cancelled subscription (status 21006)', function () {
    it('treats cancelled but not expired subscription as valid', async function () {
      const receipt = readFileSync(receiptPath).toString();
      const futureDate = Date.now() + 86400000 * 30; // 30 days from now

      const mockResponse = {
        status: 21006,
        environment: 'Production',
        receipt: {
          bundle_id: 'com.example.app',
          in_app: [
            {
              quantity: '1',
              product_id: 'com.example.subscription',
              transaction_id: '1000000461788817',
              original_transaction_id: '1000000461788817',
              purchase_date_ms: '1335798355868',
              original_purchase_date_ms: '1335798355868',
              is_trial_period: 'false',
              app_item_id: '521129812',
              expires_date_ms: String(futureDate),
            },
          ],
        },
        latest_receipt_info: [
          {
            quantity: '1',
            product_id: 'com.example.subscription',
            transaction_id: '1000000461788817',
            original_transaction_id: '1000000461788817',
            purchase_date_ms: '1335798355868',
            original_purchase_date_ms: '1335798355868',
            is_trial_period: 'false',
            app_item_id: '521129812',
            expires_date_ms: String(futureDate),
          },
        ],
      };

      nock('https://buy.itunes.apple.com').post('/verifyReceipt').reply(200, mockResponse);

      const response = await verify(receipt, {
        appSharedSecret: 'fake-shared-secret',
      });

      // Should be treated as success because subscription is cancelled but not expired
      expect(response.status).to.equal(RECEIPT_STATUS_ENUM.SUCCESS);
    });

    it('rejects truly expired subscription with status 21006', async function () {
      const receipt = readFileSync(receiptPath).toString();
      const pastDate = Date.now() - 86400000 * 30; // 30 days ago

      const mockResponse = {
        status: 21006,
        environment: 'Production',
        receipt: {
          bundle_id: 'com.example.app',
          in_app: [],
        },
        latest_receipt_info: [
          {
            quantity: '1',
            product_id: 'com.example.subscription',
            transaction_id: '1000000461788817',
            original_transaction_id: '1000000461788817',
            purchase_date_ms: '1335798355868',
            original_purchase_date_ms: '1335798355868',
            is_trial_period: 'false',
            app_item_id: '521129812',
            expires_date_ms: String(pastDate),
          },
        ],
      };

      nock('https://buy.itunes.apple.com').post('/verifyReceipt').reply(200, mockResponse);

      try {
        await verify(receipt, {
          appSharedSecret: 'fake-shared-secret',
        });
        expect.fail('Expected verification to throw');
      } catch (error: any) {
        expect(error.rejectionMessage).to.include('subscription has expired');
      }
    });
  });

  describe('verify error handling', function () {
    it('rejects with proper error for status 21003 (receipt not authenticated)', async function () {
      nock('https://buy.itunes.apple.com').post('/verifyReceipt').reply(200, { status: 21003 });

      try {
        await verify('fake-receipt', {
          appSharedSecret: 'fake-shared-secret',
        });
        expect.fail('Expected verification to throw');
      } catch (error: any) {
        expect(error.rejectionMessage).to.equal('The receipt could not be authenticated.');
        expect(error.data.status).to.equal(21003);
      }
    });

    it('rejects with proper error for status 21004 (shared secret mismatch)', async function () {
      nock('https://buy.itunes.apple.com').post('/verifyReceipt').reply(200, { status: 21004 });

      try {
        await verify('fake-receipt', {
          appSharedSecret: 'wrong-secret',
        });
        expect.fail('Expected verification to throw');
      } catch (error: any) {
        expect(error.rejectionMessage).to.equal(
          'The shared secret you provided does not match the shared secret on file for your account.',
        );
        expect(error.data.status).to.equal(21004);
      }
    });

    it('rejects with proper error for status 21005 (server not available)', async function () {
      nock('https://buy.itunes.apple.com').post('/verifyReceipt').reply(200, { status: 21005 });

      try {
        await verify('fake-receipt', {
          appSharedSecret: 'fake-shared-secret',
        });
        expect.fail('Expected verification to throw');
      } catch (error: any) {
        expect(error.rejectionMessage).to.equal('The receipt server is not currently available.');
        expect(error.data.status).to.equal(21005);
      }
    });

    it('falls back to sandbox when production returns 21008', async function () {
      const mockResponse = {
        status: 0,
        environment: 'Sandbox',
        receipt: {
          bundle_id: 'com.example.app',
          in_app: [
            {
              quantity: '1',
              product_id: 'com.example.product',
              transaction_id: '123',
              original_transaction_id: '123',
              purchase_date_ms: '1335798355868',
              original_purchase_date_ms: '1335798355868',
              is_trial_period: 'false',
              app_item_id: '521129812',
            },
          ],
        },
      };

      // Production returns 21008 (production receipt sent to sandbox - but we test fallback behavior)
      nock('https://buy.itunes.apple.com').post('/verifyReceipt').reply(200, { status: 21007 });
      nock('https://sandbox.itunes.apple.com').post('/verifyReceipt').reply(200, mockResponse);

      const response = await verify('some-receipt', {
        appSharedSecret: 'fake-shared-secret',
      });

      expect(isVerifiedReceipt(response)).to.equal(true);
    });
  });

  describe('verify with production success', function () {
    it('returns response from production without calling sandbox', async function () {
      const receipt = readFileSync(receiptPath).toString();

      const mockResponse = {
        status: 0,
        environment: 'Production',
        receipt: {
          bundle_id: 'com.example.app',
          in_app: [
            {
              quantity: '1',
              product_id: 'com.example.subscription',
              transaction_id: '1000000461788817',
              original_transaction_id: '1000000461788817',
              purchase_date_ms: '1335798355868',
              original_purchase_date_ms: '1335798355868',
              is_trial_period: 'false',
              app_item_id: '521129812',
            },
          ],
        },
      };

      const prodScope = nock('https://buy.itunes.apple.com').post('/verifyReceipt').reply(200, mockResponse);

      const response = await verify(receipt, {
        appSharedSecret: 'fake-shared-secret',
      });

      expect(isVerifiedReceipt(response)).to.equal(true);
      expect(response.environment).to.equal('Production');
      expect(prodScope.isDone()).to.equal(true);
    });
  });

  describe('getPurchasedItems parsing', function () {
    it('correctly parses trial period', function () {
      const response = {
        status: 0,
        receipt: {
          bundle_id: 'com.example.app',
          in_app: [
            {
              quantity: '1',
              product_id: 'com.example.product',
              transaction_id: '123',
              original_transaction_id: '123',
              purchase_date_ms: '1335798355868',
              original_purchase_date_ms: '1335798355868',
              is_trial_period: 'true',
              app_item_id: '521129812',
            },
          ],
        },
      } as any;

      const items = getPurchasedItems(response);
      expect(items[0].isTrialPeriod).to.equal(true);
    });

    it('correctly parses cancellation date', function () {
      const response = {
        status: 0,
        receipt: {
          bundle_id: 'com.example.app',
          in_app: [
            {
              quantity: '1',
              product_id: 'com.example.product',
              transaction_id: '123',
              original_transaction_id: '123',
              purchase_date_ms: '1335798355868',
              original_purchase_date_ms: '1335798355868',
              is_trial_period: 'false',
              app_item_id: '521129812',
              cancellation_date_ms: '1335798400000',
            },
          ],
        },
      } as any;

      const items = getPurchasedItems(response);
      expect(items[0].cancellationDateMS).to.equal(1335798400000);
    });

    it('correctly parses expiration date', function () {
      const response = {
        status: 0,
        receipt: {
          bundle_id: 'com.example.app',
          in_app: [
            {
              quantity: '1',
              product_id: 'com.example.product',
              transaction_id: '123',
              original_transaction_id: '123',
              purchase_date_ms: '1335798355868',
              original_purchase_date_ms: '1335798355868',
              is_trial_period: 'false',
              app_item_id: '521129812',
              expires_date_ms: '1335798500000',
            },
          ],
        },
      } as any;

      const items = getPurchasedItems(response);
      expect(items[0].expirationDateMS).to.equal(1335798500000);
    });
  });
});
