import fs from 'fs-extra';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { writeFileSync } from './fs';

vi.mock('fs-extra', () => ({
  default: {
    ensureDirSync: vi.fn(),
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

test('writeFileSync should create directory and write file if file does not exist', () => {
  const filePath = '/path/to/file.txt';
  const content = 'test content';

  vi.mocked(fs.existsSync).mockReturnValue(false);

  writeFileSync(filePath, content);

  expect(fs.ensureDirSync).toHaveBeenCalledWith('/path/to');
  expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, content);
});

test('writeFileSync should not write if file exists with same content', () => {
  const filePath = '/path/to/file.txt';
  const content = 'test content';

  vi.mocked(fs.existsSync).mockReturnValue(true);
  vi.mocked(fs.readFileSync).mockReturnValue(content);

  writeFileSync(filePath, content);

  expect(fs.ensureDirSync).toHaveBeenCalledWith('/path/to');
  expect(fs.writeFileSync).not.toHaveBeenCalled();
});

test('writeFileSync should write if file exists with different content', () => {
  const filePath = '/path/to/file.txt';
  const newContent = 'new content';

  vi.mocked(fs.existsSync).mockReturnValue(true);
  vi.mocked(fs.readFileSync).mockReturnValue('old content');

  writeFileSync(filePath, newContent);

  expect(fs.ensureDirSync).toHaveBeenCalledWith('/path/to');
  expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, newContent);
});
