import { expect } from 'chai';
import { readFileSync } from 'fs-extra';
import { getPurchaseData, isValidated, validate } from '../index';
import { join } from 'path';

const receiptPath = join(__dirname, './receipts/apple');

describe('iap-apple', function () {
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
    const res = getPurchaseData(data as any);
    console.log(res);
    expect(res.length).to.equal(1);
    expect(res[0].originalTransactionId).to.equal('1000000381600687');
    expect(res[0].purchaseDateMS).to.equal(1520540670000);
    expect(res[0].isTrialPeriod).to.equal(false);
  });

  it('Can validate apple in-app-purchase', async () => {
    const receipt = readFileSync(receiptPath).toString();

    const response = await validate(receipt, {
      logger: console,
    });
    expect(isValidated(response)).to.equal(true);
    const data = getPurchaseData(response);
    for (let i = 0; i < data.length; i++) {
      console.log('parsedPurchaseData:', i, data);
      expect(data[i].productId).not.to.equal(undefined);
      expect(data[i].purchaseDateMS).not.to.equal(undefined);
      expect(data[i].quantity).to.not.equal(undefined);
    }
  });

  it('Can NOT validate apple in-app-purchase with incorrect receipt w/ auto-service detection', async () => {
    try {
      await validate('fake-receipt', {
        logger: console,
      });
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

  it('Can detect a valid receipt that bought nothing', async () => {
    const receipt =
      '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';

    try {
      await validate(receipt, {
        logger: console,
      });
    } catch (error) {
      expect(error).not.to.equal(undefined);
    }
  });

  it('can parse both in_app and latest_receipt_info array with .getPurchaseData()', function () {
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

    const parsed = getPurchaseData(rec as any);
    const res = ['in_app.0', 'latest_receipt_info.0', 'latest_receipt_info.1'];

    for (let i = 0; i < parsed.length; i++) {
      if (res.indexOf(parsed[i].productId) === -1) {
        console.error(parsed[i]);
        throw new Error('missing purchase data');
      }
      console.log(parsed[i].productId, parsed[i].transactionId);
    }
  });

  it('can parse without latest_receipt_info array with .getPurchaseData()', function () {
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

    const parsed = getPurchaseData(rec as any);
    const res = ['in_app.0'];
    for (let i = 0; i < parsed.length; i++) {
      if (res.indexOf(parsed[i].productId) === -1) {
        throw new Error('missing purchase data');
      }
      console.log(parsed[i].productId, parsed[i].transactionId);
    }
  });
});
