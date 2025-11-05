**README.md**

# Express Router Modularization

Organize Express applications using routers and controllers for better maintainability.

## Core Concepts

- **Router**: Handles a group of related routes (e.g., all `/api/*` routes).
- **Controller**: Contains business logic for a route (e.g., fetching data, database interaction).

## File Structure

```
project/
├── server.js
├── routes/
│   └── apiRoutes.js
└── controllers/
    ├── productsController.js
    └── servicesController.js
```

## Implementation

### `controllers/productsController.js`

```js
const productsController = (req, res) => {
	res.json({ message: "Products data" });
};

module.exports = productsController;
```

### `controllers/servicesController.js`

```js
const servicesController = (req, res) => {
	res.json({ message: "Services data" });
};

module.exports = servicesController;
```

### `routes/apiRoutes.js`

```js
const express = require("express");
const router = express.Router();

const productsController = require("../controllers/productsController");
const servicesController = require("../controllers/servicesController");

router.get("/products", productsController);
router.get("/services", servicesController);

module.exports = router;
```

### `server.js`

```js
const express = require("express");
const app = express();

const apiRoutes = require("./routes/apiRoutes");

app.use("/api", apiRoutes);

// 404 fallback
app.use((req, res) => {
	res.status(404).json({ error: "Endpoint not found" });
});

app.listen(3000, () => {
	console.log("Server running on port 3000");
});
```

## Notes

- Route paths in `apiRoutes.js` are **relative** to `/api` (e.g., `/products` becomes `/api/products`).
- The fallback 404 handler must be placed **after** all defined routes.
- This structure makes it easy to scale: add new controllers and routes without cluttering `server.js`.
