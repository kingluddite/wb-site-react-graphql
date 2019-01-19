import formatMoney from '../lib/formatMoney';

describe('formatMoney Function', () => {
  it('works with fractional dollars', () => {
    expect(formatMoney(1)).toEqual('$0.01');
    expect(formatMoney(9)).toEqual('$0.09');
    expect(formatMoney(10)).toEqual('$0.10');
    expect(formatMoney(50)).toEqual('$0.50');
  });

  it('leaves off cents for whole dollars', () => {
    expect(formatMoney(100)).toEqual('$1');
    expect(formatMoney(5000)).toEqual('$50');
    expect(formatMoney(50000000)).toEqual('$500,000');
  });

  it('works with whole and fractional dollars', () => {
    expect(formatMoney(4013)).toEqual('$40.13');
    expect(formatMoney(101)).toEqual('$1.01');
    expect(formatMoney(110)).toEqual('$1.10');
    expect(formatMoney(898234923492302389434)).toEqual('$8,982,349,234,923,024,000.00');
  });
});
