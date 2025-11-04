# Handling Requests and Responses in an API

In our API, handling a **request** involves more than just sending data.
It’s about interpreting what the client is asking for, processing that request, and returning a structured **response**.

---

## Request Handling

When a client makes a request to our server, there are several possibilities:

- The client may want the **entire dataset**.
- The client might specify filters — for example, requesting only startups from a certain country or industry.
- The request could contain **errors**, such as typos in the path or invalid query parameters.

The server must handle all these cases gracefully.

---

## Response Structure

Once the request has been processed, the **response** is generated and sent back to the client over **HTTP**.
A response typically includes several key parts:

### 1. **Data**

The content requested by the client — for example, a filtered list of startups.

### 2. **Content-Type**

Indicates the format of the returned data.
For our API, this will be:
