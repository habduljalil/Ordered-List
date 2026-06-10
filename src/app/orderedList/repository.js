const db = require("../../database");

function createList(name) {

    return new Promise((resolve, reject) => {

        db.run(
            "INSERT INTO lists (name) VALUES (?)",
            [name],
            function (err) {

                if (err) {
                    return reject(err);
                }

                resolve({
                    id: this.lastID,
                    name
                });
            }
        );

    });
}

function getLists() {
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT id, name FROM lists ORDER BY id ASC",
            [],
            (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            }
        );
    });
}

function createItem(listId, item) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT MAX(position) as maxPos FROM items WHERE list_id = ?",
            [listId],
            (err, row) => {
                if (err) return reject(err);
                const pos = (row && row.maxPos) ? row.maxPos + 1 : 1;
                db.run(
                    "INSERT INTO items (list_id, title, position) VALUES (?, ?, ?)",
                    [listId, item, pos],
                    function (err) {
                        if (err) return reject(err);
                        resolve({ id: this.lastID, listId, item, position: pos });
                    }
                );
            }
        );
    });
}

function getItemsByList(listId) {
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT id, list_id as listId, title as item, position FROM items WHERE list_id = ? ORDER BY position ASC",
            [listId],
            (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            }
        );
    });
}

function getItemById(id) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT id, list_id as listId, title as item, position FROM items WHERE id = ?",
            [id],
            (err, row) => {
                if (err) return reject(err);
                resolve(row);
            }
        );
    });
}

function moveItemPosition(itemId, newPosition, listId, oldPos) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("BEGIN TRANSACTION", (err) => {
                if (err) return reject(err);

                db.run(
                    "UPDATE items SET position = 0 WHERE id = ?",
                    [itemId],
                    (err) => {
                        if (err) return db.run("ROLLBACK", () => reject(err));
   
                        const isMovingUp = newPosition < oldPos;
                        let currentPosition = isMovingUp ? oldPos - 1 : oldPos + 1;

                        function shiftNext() {
                            if (isMovingUp && currentPosition < newPosition) {
                                return placeMovedItem();
                            }

                            if (!isMovingUp && currentPosition > newPosition) {
                                return placeMovedItem();
                            }

                            const sql = isMovingUp
                                ? "UPDATE items SET position = position + 1 WHERE list_id = ? AND position = ?"
                                : "UPDATE items SET position = position - 1 WHERE list_id = ? AND position = ?";

                            db.run(sql, [listId, currentPosition], (err) => {
                                if (err) return db.run("ROLLBACK", () => reject(err));

                                currentPosition = isMovingUp ? currentPosition - 1 : currentPosition + 1;
                                shiftNext();
                            });
                        }

                        function placeMovedItem() {
                            db.run(
                                "UPDATE items SET position = ? WHERE id = ?",
                                [newPosition, itemId],
                                (err) => {
                                    if (err) return db.run("ROLLBACK", () => reject(err));

                                    db.run("COMMIT", (err) => {
                                    if (err) return db.run("ROLLBACK", () => reject(err));

                                        resolve({
                                            id: itemId,
                                            listId,
                                            position: newPosition
                                        });
                                    });
                                }
                            );
                        }

                        shiftNext();
                    }
                );
            });
        });
    });
}

function validatePosition(listId, newPosition, oldPos) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT COUNT(*) as cnt FROM items WHERE list_id = ?",
            [listId],
            (err, row) => {
                if (err) return reject(err);

                const count = row ? row.cnt : 0;

                if (newPosition < 1 || newPosition > count) {
                    const error = new Error(
                        `Position must be between 1 and ${count}`
                    );
                    error.statusCode = 400;
                    return reject(error);
                }

                resolve({
                    count,
                    isSamePosition: newPosition === oldPos
                });
            }
        );
    });
}

function deleteItem(id, listId, oldPos) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("BEGIN TRANSACTION", (err) => {
                if (err) return reject(err);

                db.run(
                    "DELETE FROM items WHERE id = ?",
                    [id],
                    (err) => {
                        if (err) return db.run("ROLLBACK", () => reject(err));

                        db.run(
                            `
                            UPDATE items
                            SET position = position - 1
                            WHERE list_id = ?
                            AND position > ?
                            `,
                            [listId, oldPos],
                            (err) => {
                                  if (err) return db.run("ROLLBACK", () => reject(err));

                                    db.run("COMMIT", (err) => {
                                    if (err) return db.run("ROLLBACK", () => reject(err));


                                    resolve({
                                        id,
                                        listId
                                    });
                                });
                            }
                        );
                    }
                );
            });
        });
    });
}

async function getListById(id) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT id, name FROM lists WHERE id = ?",
            [id],
            (err, row) => {
                if (err) return reject(err);
                resolve(row);
            }
        );
    });
}

module.exports = {
    createList,
    getLists,
    createItem,
    validatePosition,
    getItemsByList,
    getItemById,
    moveItemPosition,
    deleteItem,
    getListById
};
