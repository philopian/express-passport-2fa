const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAllItems = async () => {
  return await prisma.posts.findMany();
};

const getItemById = async (id) => {
  return await prisma.posts.findUnique({
    where: {
      id: parseInt(id),
    },
  });
};

const createItem = async (data) => {
  return await prisma.posts.create({
    data,
  });
};

const updateItem = async (id, data) => {
  return await prisma.posts.update({
    where: {
      id: parseInt(id),
    },
    data,
  });
};

const deleteItem = async (id) => {
  return await prisma.posts.delete({
    where: {
      id: parseInt(id),
    },
  });
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
