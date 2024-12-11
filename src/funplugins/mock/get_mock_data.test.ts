import { join } from 'path';
import { expect, test } from 'vitest';
import { getMockData } from './get_mock_data';

const fixtures = join(__dirname, 'fixtures');

test('basic mock data loading', () => {
  const data = getMockData({
    cwd: fixtures,
    paths: ['basic'],
  });
  expect(Object.keys(data)).toHaveLength(2);

  const usersRoute = data['GET /api/users'];
  const userDetailRoute = data['GET /api/users/1'];

  expect(usersRoute).toBeDefined();
  expect(userDetailRoute).toBeDefined();
  expect(typeof usersRoute!.handler).toBe('function');
  expect(Array.isArray(userDetailRoute!.handler)).toBe(true);
});

test('support different HTTP methods', () => {
  const data = getMockData({
    cwd: fixtures,
    paths: ['methods'],
  });
  expect(Object.keys(data)).toHaveLength(3);
  expect(data['GET /api/users']).toBeDefined();
  expect(data['POST /api/users']).toBeDefined();
  expect(data['PUT /api/users/1']).toBeDefined();
});

test('throw error for invalid HTTP method', () => {
  expect(() =>
    getMockData({
      cwd: fixtures,
      paths: ['invalid_method'],
    }),
  ).toThrow('method INVALID is not supported');
});

test('throw error for duplicate routes', () => {
  expect(() =>
    getMockData({
      cwd: fixtures,
      paths: ['duplicate'],
    }),
  ).toThrow('Duplicate mock id: GET /api/users');
});

test('support glob pattern', () => {
  const data = getMockData({
    cwd: fixtures,
    paths: ['glob/*'],
  });
  expect(Object.keys(data)).toHaveLength(3);
  expect(data['GET /api/users']).toBeDefined();
  expect(data['GET /api/posts']).toBeDefined();
  expect(data['GET /api/posts/1']).toBeDefined();
});
