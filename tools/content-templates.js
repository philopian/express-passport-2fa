const controllerFileContent = (componentName) => `const express = require("express");
const router = express.Router();

const { getAllItems, getItemById, createItem, updateItem, deleteItem } = require("./${componentName}.service");

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
`;

const serviceFileContent = (componentName) => `const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAllItems = async () => {
  return await prisma.${componentName}.findMany();
};

const getItemById = async (id) => {
  return await prisma.${componentName}.findUnique({
    where: { id },
  });
};

const createItem = async (data) => {
  return await prisma.${componentName}.create({
    data,
  });
};

const updateItem = async (id, data) => {
  return await prisma.${componentName}.update({
    where: { id },
    data,
  });
};

const deleteItem = async (id) => {
  return await prisma.${componentName}.delete({
    where: { id },
  });
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};

`;

const prismaFileContent = (componentName) => `model ${componentName} {
  id      String  @id @default(uuid())
  message String  @unique
}


`;

const swaggerFileContent = (componentName) => `{
  "paths": {
    "/${componentName}/": {
      "get": {
        "tags": ["${componentName}"],
        "description": "Get all items",
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      },
      "post": {
        "tags": ["${componentName}"],
        "description": "Add a new item",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string"
                  }
                },
                "required": ["name"]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created"
          },
          "400": {
            "description": "Bad request"
          }
        }
      }
    },
    "/${componentName}/{id}": {
      "get": {
        "tags": ["${componentName}"],
        "description": "Get a single item by ID",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "description": "ID of the item to retrieve",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          },
          "404": {
            "description": "Not found"
          }
        }
      },
      "put": {
        "tags": ["${componentName}"],
        "description": "Update an existing item by ID",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "description": "ID of the item to update",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string"
                  }
                },
                "required": ["message"]
              }
            }
          }
        },
        "responses": {
          "204": {
            "description": "No content"
          },
          "400": {
            "description": "Bad request"
          },
          "404": {
            "description": "Not found"
          }
        }
      },
      "delete": {
        "tags": ["${componentName}"],
        "description": "Delete an item by ID",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "description": "ID of the item to delete",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "No content"
          },
          "404": {
            "description": "Not found"
          }
        }
      }
    }
  }
}
`;

module.exports = {
  controllerFileContent,
  serviceFileContent,
  prismaFileContent,
  swaggerFileContent,
};
