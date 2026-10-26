# Halves

Split group expenses with friends: equally, by exact amounts, or item by item from a scanned receipt. Halves shows each person's balance and the fewest payments needed to settle up, with Venmo pay links.

## Why Halves, not Splitwise?

Splitwise is a good app, but its free plan has become hard to use. Free users hit a daily limit of roughly 3–5 expenses, see ads between screens, and lose features that used to be free. Splitwise Pro costs about $4.99 a month. Halves gives you all of it for free.

| | Splitwise Free | Splitwise Pro | Halves |
|---|---|---|---|
| Price | Free | ~$4.99/month | Free |
| Expenses per day | ~3–5 | Unlimited | Unlimited |
| Ads | Yes | No | No |
| Receipt scanning | No | Yes | Yes, and it also picks up currency and category |
| Split by item | No | Yes | Yes, with tax and tip shared by what each person ordered |
| Currency conversion | No | Yes | Yes, with the rate visible and editable |
| Search expenses | No | Yes | Yes, plus a category filter |
| Spending charts | No | Yes | Yes, by category and by month |
| Default split per group | No | Yes | Yes |
| Fewest-payment settle-up | Yes | Yes | Yes |
| Export to CSV | Yes | Yes | Yes, same column layout |

Also in Halves:

- **Your side first.** Every expense says "you lent" or "you borrowed", and the Friends tab totals what each person owes you across all groups.
- **Exact to the cent.** All money is kept in whole cents, and leftover pennies are handed out fairly, so balances always net to zero. A test checks this.
- **Pay in one tap.** Each suggested payment links to Venmo with the amount filled in.
- **Small and open.** Two files, no build step. Read it, fork it, change it.

Where Splitwise is still better today:

- **Everyone already has it.** Your friends don't need to learn anything new.
- **Native iOS and Android apps,** plus push notifications and comments on expenses.
- **Card import (US).** Splitwise Pro pulls in card transactions. Halves doesn't yet.
- **Recurring expenses.** Rent and bills that repeat every month.

These are listed under "Not built yet" below.

Splitwise feature and pricing details are as of 2026, from public reviews and pricing pages. Check splitwise.com for the current plan.

## Files

| File | What it is |
|------|------------|
| `index.html` | The whole app: UI, storage, receipt scanning |
| `splits.js` | Pure money math (integer cents): splitting, balances, settle-up plan |
| `tests/splits.test.js` | Checks that every split adds up to the cent and balances net to zero |

## Run it

```sh
npx serve .          # then open http://localhost:3000
node tests/splits.test.js
```

Opened outside claude.ai, the app runs in **preview mode** with an example trip, and nothing is saved.

## How it's hosted today

The live version runs as a claude.ai artifact. There it gets two platform features through `window.claude.use()`:

- `db`: shared storage, so everyone the page is shared with sees the same groups (collections `groups` and `expenses`)
- `sample`: Claude reads receipt photos and returns the items

To host it elsewhere, swap `dbStore()` in `index.html` for a real backend (Supabase or Firebase fit the same shape) and replace the receipt call with your own model API.

## Features

Matches Splitwise Pro, except card import:

- Unlimited expenses, no ads
- Splits: equal, exact amounts, shares or percentages, and by item
- Receipt scanning that fills in the items, tax, tip, category and currency
- Multi-currency: each group has a home currency, and expenses in other currencies convert at a rate you can see and change
- Custom default split for each group
- Charts: spending by category and by month
- Search and filter expenses by text, person or category
- Edit or delete any expense; group settings for people, Venmo usernames and currency
- Dark, light or system theme, remembered on each device
- Home overview: greeting, your total by currency, your suggested payments across all groups, latest activity
- "Start fresh" clears the example trip; delete any group from its settings
- CSV export, one column per person, in the same layout as Splitwise's export
- Fewest-payment settle-up plan, Venmo pay links and payment records

## Not built yet

- Importing transactions from cards (needs a bank-data provider such as Plaid, plus a backend)
- Live exchange rates inside claude.ai: the viewer blocks outside requests, so people type the rate there. On a standalone host, rates load from api.frankfurter.app.
- Recurring expenses, comments on expenses, notifications
- Sign-in on a standalone host
