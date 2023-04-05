const express = require("express");
const router = express.Router();

const { getAllItems, getItemById, createItem, updateItem, deleteItem } = require("./posts.service");

// GET all items
router.get("/", async (req, res) => {
  // Code to get all items from the database
  try {
    const data = await getAllItems();
    res.json({ data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// GET a single item by ID
router.get("/:id", async (req, res) => {
  // Code to get a single item by ID from the database
  const { id } = req.params;
  try {
    const data = await getItemById(id);
    res.json({ data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// POST a new item
router.post("/", async (req, res) => {
  // Code to add a new item to the database
  const { body } = req;
  try {
    const data = await createItem(body);
    res.json({ data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// PUT update an existing item by ID
router.put("/:id", async (req, res) => {
  // Code to update an existing item by ID in the database
  const { id } = req.params;
  const { body } = req;
  try {
    const data = await updateItem(id, body);
    res.json({ data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// DELETE an item by ID
router.delete("/:id", async (req, res) => {
  // Code to delete an item by ID from the database
  const { id } = req.params;
  try {
    const data = await deleteItem(id);
    res.json({ data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
