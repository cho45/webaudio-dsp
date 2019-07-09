
// import { Complex } from "../src/complex";
import { ComplexFloat32InterleavedArray } from '../src/complex-typedarray';
import { FFT } from '../src/fft';

describe("FFT", () => {
	test("fft", () => {
		const c = new ComplexFloat32InterleavedArray([11, 6, -9, 1, 6, -12, -14, 7, -5, 5, -6, 3, -10, -3, -1, -1]);
		const fft = new FFT(c.length);
		const F = fft.fft(c);
		const f1 = fft.ifft(F);
		/*
		console.log(f1);
		console.log(Array.from(f1).map(c => Math.round(c.real)));
		console.log(Array.from(f1).map(c => Math.round(c.imag)));
		*/
		for (let [i, item] of f1.entries()) {
			expect(item.real).toBeCloseTo(c.get(i).real);
			expect(item.imag).toBeCloseTo(c.get(i).imag);
		}
	});
});
