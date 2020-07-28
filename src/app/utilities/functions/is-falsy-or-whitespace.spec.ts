import { isFalsyOrWhitespace } from './is-falsy-or-whitespace';

describe('isFalsyOrWhitespace', () => {
  const testCases = [
      { value: null, expected: true },
      { value: undefined, expected: true },
      { value: '', expected: true },
      { value: '                 ', expected: true },
      { value: '    ', expected: true },
      { value: 'undefined', expected: false },
      { value: 'null', expected: false },
      { value: 'some non blank string', expected: false },
      { value: '          a                ', expected: false }
  ];
  testCases.forEach(input => {
    it(`should determine ${input.value} ${input.expected ? 'not' : ''} to be falsy or whitespace`, () => {
        expect(isFalsyOrWhitespace(input.value)).toBe(input.expected);
    });
  });
});
