const BASE_URL = "http://localhost:3000";

let passed = 0;
let failed = 0;

function pass(num, msg) {
  console.log(`\x1b[32mPASS ${num}\x1b[0m: ${msg}`);
  passed++;
}

function fail(num, msg) {
  console.log(`\x1b[31mFAIL\x1b[0m ${num}: ${msg}`);
  failed++;
}

async function api(method, path, body) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json().catch(() => ({}));
    return { status: res.status, body: json };
  } catch (err) {
    return { status: 0, body: { success: false, message: err.message } };
  }
}

const createList = (name) => api("POST", "/lists", { name });
const addItem = (listId, item) => api("POST", `/lists/${listId}/items`, { item });
const getItems = (listId) => api("GET", `/lists/${listId}/items`);
const getItem = (itemId) => api("GET", `/items/${itemId}`);
const moveItem = (itemId, position) =>
  api("PATCH", `/items/${itemId}/position`, { position });
const deleteItem = (itemId) => api("DELETE", `/items/${itemId}`);

function data(res) {
  return res.body.data;
}

function responseInfo(res) {
  return `${colorStatus(res.status)}: ${res.body.message || "No message"}`;
}

function isCleanSequence(items, expectedLength) {
  return (
    Array.isArray(items) &&
    items.length === expectedLength &&
    items.every((item, index) => item.position === index + 1)
  );
}

function isExpectedError(res, expectedStatus) {
  return (
    res.status === expectedStatus &&
    res.body.success === false
  );
}

function colorStatus(status) {
  return status >= 400
    ? `\x1b[31m${status}\x1b[0m`
    : `\x1b[32m${status}\x1b[0m`;
}

async function runTests() {
  let listId = null;
  let items = [];

  // 1
  try {
    const listRes = await createList("Test List " + Date.now());

    if (listRes.status !== 201 || !data(listRes)?.id) {
      throw new Error(
        `Create list failed. Status: ${colorStatus(listRes.status)}, Body: ${JSON.stringify(listRes.body)}`
      );
    }

    listId = data(listRes).id;

    for (let i = 1; i <= 5; i++) {
      const addRes = await addItem(listId, `Item ${i}`);

      if (addRes.status !== 201) {
        throw new Error(
          `Add item ${i} failed. Status: ${colorStatus(addRes.status)}, Body: ${JSON.stringify(addRes.body)}`
        );
      }
    }

    const itemsRes = await getItems(listId);
    items = data(itemsRes) || [];

    if (isCleanSequence(items, 5)) {
  pass(
  1,
  `Created list and added 5 items with positions 1-5 (${responseInfo(itemsRes)})`
);
    } else {
      
      fail(1, `Items are not positions 1-5. Body: ${JSON.stringify(itemsRes.body)}`);
    }
  } catch (err) {
    fail(1, err.message);
  }

  // 2
  try {
    const itemsRes = await getItems(listId);
    items = data(itemsRes) || [];

    if (isCleanSequence(items, 5)) {
      pass(2, `Items fetched and sorted correctly (${responseInfo(itemsRes)})`);
    } else {
      fail(2, `Items are not sorted correctly. Body: ${JSON.stringify(itemsRes.body)}`);
    }
  } catch (err) {
    fail(2, err.message);
  }

  // 4
  try {
    const position3Item = items.find((item) => item.position === 3);

    if (!position3Item) {
      throw new Error("No item found at position 3");
    }

    const moveRes = await moveItem(position3Item.id, 1);

    const itemsRes = await getItems(listId);
    items = data(itemsRes) || [];

    if (
      moveRes.status === 200 &&
      items[0]?.id === position3Item.id &&
      isCleanSequence(items, 5)
    ) {
      pass(4, `Moved position 3 item to position 1 (${responseInfo(moveRes)})`);
    } else {
      fail(
        4,
        `Position 3 item was not moved correctly. Move body: ${JSON.stringify(moveRes.body)}`
      );
    }
  } catch (err) {
    fail(4, err.message);
  }

  // 5
  try {
    const itemsRes = await getItems(listId);
    items = data(itemsRes) || [];

    if (isCleanSequence(items, 5)) {
      pass(5, `List is still clean 1-5 sequence (${responseInfo(itemsRes)})`);
    } else {
      fail(5, `List sequence is not clean 1-5. Body: ${JSON.stringify(itemsRes.body)}`);
    }
  } catch (err) {
    fail(5, err.message);
  }

  // 9
  try {
    const item = items[0];

    if (!item) {
      throw new Error("No item available for position 0 test");
    }

    const res = await moveItem(item.id, 0);

    if (isExpectedError(res, 400)) {
      pass(9, `Moving item to position 0 returned clear error (${responseInfo(res)})`);
    } else {
      fail(
        9,
        `Expected 400 clear error. Got ${res.status}: ${JSON.stringify(res.body)}`
      );
    }
  } catch (err) {
    fail(9, err.message);
  }

  // 10
  try {
    const item = items[0];

    if (!item) {
      throw new Error("No item available for position 99 test");
    }

    const res = await moveItem(item.id, 99);

    if (isExpectedError(res, 400)) {
      pass(10, `Moving item to position 99 returned clear error (${responseInfo(res)})`);
    } else {
      fail(
        10,
        `Expected 400 clear error. Got ${res.status}: ${JSON.stringify(res.body)}`
      );
    }
  } catch (err) {
    fail(10, err.message);
  }

  // 11
  try {
    const res = await getItem(999999);

    if (isExpectedError(res, 404)) {
      pass(11, `Fetching non-existing item returned clear error (${responseInfo(res)})`);
    } else {
      fail(
        11,
        `Expected 404 clear error. Got ${res.status}: ${JSON.stringify(res.body)}`
      );
    }
  } catch (err) {
    fail(11, err.message);
  }

  // 12
  try {
    const itemsRes = await getItems(listId);
    items = data(itemsRes) || [];

    const position3Item = items.find((item) => item.position === 3);

    if (!position3Item) {
      throw new Error("No item found at position 3");
    }

    const res = await deleteItem(position3Item.id);

    if (
      res.status === 200 &&
      res.body.success === true &&
      res.body.message === "Item deleted successfully"
    ) {
      pass(12, `Deleted item at position 3 successfully (${responseInfo(res)})`);
    } else {
      fail(
        12,
        `Expected 200 "Item deleted successfully". Got ${res.status}: ${JSON.stringify(res.body)}`
      );
    }
  } catch (err) {
    fail(12, err.message);
  }

  // 13
  try {
    const itemsRes = await getItems(listId);
    items = data(itemsRes) || [];

    if (isCleanSequence(items, 4)) {
      pass(13, `Remaining items are clean 1-4 sequence (${responseInfo(itemsRes)})`);
    } else {
      fail(
        13,
        `Expected clean 1-4 sequence. Got ${items.length} items. Body: ${JSON.stringify(itemsRes.body)}`
      );
    }
  } catch (err) {
    fail(13, err.message);
  }

  console.log(`\nTests finished: ${passed} passed, ${failed} failed`);
}

runTests();