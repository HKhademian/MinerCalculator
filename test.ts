import './src/lib/_global.ts';

const P = 7;

const base: [string, number][] = Object.entries({
  hos: 1.513,
  mit: 0.895,
  ali: 0.804,
  sae: 0.619,
  zah: 0.273,
  fat: 0.153,
  hom: 0.000,
  sek: 1.743,
});
const sumB = base.sumBy(0, ([_, v]) => v);
const shares: [string, number][] = base.map(([u, v]) => [u, Math.floor(v / sumB * 1000)]);
const powers: [string, number][] = shares.map(([u, v]) => [u, v * P]);

console.log("base", base, sumB);
console.log("shares", shares, shares.sumBy(0, ([_, v]) => v));
console.log("powers", powers, powers.sumBy(0, ([_, v]) => v));
