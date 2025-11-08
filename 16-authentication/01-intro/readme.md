# Authentication Overview

This section introduces **authentication** — a core backend skill — using `express-session`. You’ll learn how to register users, log them in/out, and display user-specific data (like shopping carts).

## Goals

- Implement signup, login, and logout.
- Manage user sessions with `express-session`.
- Protect routes and show user-specific data (e.g., cart items).
- Understand core authentication concepts: **sessions**, **validation**, **hashing**, and **bcrypt**.

## App Behavior

- Header shows `Welcome, guest` with **Login** and **Sign Up** buttons.
- After creating an account, the header updates to `Welcome, <username>` and shows a **Logout** button.
- Clicking logout returns the header to `Welcome, guest`.
- Logged-in users can:

  - Add items to their cart.
  - See item count in the cart icon.
  - View cart contents on the cart page.
  - Remove items from the cart.
  - Checkout to clear their order (no payment gateway included).

## Key Technology

- **express-session**

  - Simplest way to handle sessions and authentication while learning how auth works internally.
  - Alternatives exist but are more complex and add unnecessary abstraction.

## Concepts Covered

- Session management (`express-session`).
- Input validation.
- Password hashing using **bcrypt**.
- Route protection for authenticated users.
- Working with **SQLite3** for user and cart data.

## Frontend Notes

- New frontend code is located in the `/public` folder.
- Some code in `index.js` and `cart.js` is commented out temporarily to prevent frontend errors.
- These will be re-enabled after backend authentication is complete.

## Next Steps

1. Review SQLite3 method primer before proceeding.
2. Set up `express-session` and configure session middleware.
3. Implement signup, login, logout routes.
4. Integrate with frontend components once backend is stable.
