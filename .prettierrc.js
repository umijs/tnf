export default {
  printWidth: 80,
  singleQuote: true,
  trailingComma: 'all',
  proseWrap: 'never',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: ['^react', '^@umijs/tnf/?', '^@?\\w', '^@/', '^[./]'],
  importOrderSortSpecifiers: true,
};
