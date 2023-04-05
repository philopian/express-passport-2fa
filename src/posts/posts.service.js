const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllItems = async () => {
  return await prisma.item.findMany();
};

const getItemById = async (id) => {
  return await prisma.item.findUnique({
    where: {
      id: parseInt(id),
    },
  });
};

const createItem = async (data) => {
  return await prisma.item.create({
    data,
  });
};

const updateItem = async (id, data) => {
  return await prisma.item.update({
    where: {
      id: parseInt(id),
    },
    data,
  });
};

const deleteItem = async (id) => {
  return await prisma.item.delete({
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
