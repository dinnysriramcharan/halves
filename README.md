# Halves

Split group expenses with friends: equally, by exact amounts, or item by item from a scanned receipt. Halves shows each person's balance and the fewest payments needed to settle up, with Venmo pay links.

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

## Not built yet

- Edit an existing expense (today: delete and re-add)
- Currencies other than USD
- Add or remove people after a group is created
- Sign-in on a standalone host
