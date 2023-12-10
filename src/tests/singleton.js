const { mockDeep, mockReset } = require('jest-mock-extended');

const prisma = require('../database/client');

const prismaMock = prisma;

jest.mock('../database/client', () => mockDeep());

beforeEach(() => {
  	mockReset(prismaMock);
})

module.exports = {prismaMock};