//#!/usr/bin/env npx jest

import { Complex, complex } from "../src/complex";
import { ComplexFloat32DoubledArray, ComplexFloat32InterleavedArray } from '../src/complex-typedarray';

for (let ComplexFloat32Array of [ComplexFloat32InterleavedArray, ComplexFloat32DoubledArray]) {
	describe(`${ComplexFloat32Array.name}`, () => {
		describe("new", () => {
			test(" from real array", () => {
				const c = new ComplexFloat32Array([1, 2, 3, 4, 5]);
				expect(c.get(0)).toEqual(complex(1, 0));
			});

			test(" from complex-likearray", () => {
				const c = new ComplexFloat32Array([ [1, 2], [3, 4] ]);
				expect(c.get(0)).toEqual(complex(1, 2));
				expect(c.get(1)).toEqual(complex(3, 4));
			});

			test(" with length", () => {
				const c = new ComplexFloat32Array(3);
				expect(c.get(0)).toEqual(complex(0, 0));
				expect(c.get(1)).toEqual(complex(0, 0));
				expect(c.get(2)).toEqual(complex(0, 0));
				expect(() => c.get(3)).toThrow("index out of range");
			});
		});

		describe("#get", () => {
			test("get", () => {
				const c = new ComplexFloat32Array(3);
				expect(c.get(0)).toEqual(complex(0, 0));
				expect(c.get(1)).toEqual(complex(0, 0));
				expect(c.get(2)).toEqual(complex(0, 0));
				expect(() => c.get(3)).toThrow("index out of range");
			});
		});

		describe("#set", () => {
			test("set(index, value)", () => {
				const c = new ComplexFloat32Array(3);
				c.set(0, [10, -10]);

				expect(c.get(0)).toEqual(complex(10, -10));
			});
		});

		describe("#setArray", () => {
			test("set(array, offset)", () => {
				const c = new ComplexFloat32Array(3);
				c.setArray([1, 2, 3], 1);

				expect(c.get(0)).toEqual(complex(0, 0));
				expect(c.get(1)).toEqual(complex(1, 0));
				expect(c.get(2)).toEqual(complex(2, 0));
			});
		});

		describe("#copyWithIn", () => {
			test("1", () => {
				const c = new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
				c.copyWithin(1, 0);
				expect(c.get(0)).toEqual(complex(1, -1));
				expect(c.get(1)).toEqual(complex(1, -1));
				expect(c.get(2)).toEqual(complex(2, -2));
				expect(c.get(3)).toEqual(complex(3, -3));
				expect(c.get(4)).toEqual(complex(4, -4));
				expect(() => c.get(5)).toThrow("index out of range");
			});
			test("2", () => {
				const c = new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
				c.copyWithin(2, 0);
				expect(c.get(0)).toEqual(complex(1, -1));
				expect(c.get(1)).toEqual(complex(2, -2));
				expect(c.get(2)).toEqual(complex(1, -1));
				expect(c.get(3)).toEqual(complex(2, -2));
				expect(c.get(4)).toEqual(complex(3, -3));
				expect(() => c.get(5)).toThrow("index out of range");
			});
		});

		describe("#subarray", () => {
			test("subarray(0)", () => {
				const c0= new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
				const c  = c0.subarray(0);
				expect(c.get(0)).toEqual(complex(1, -1));
				expect(c.get(1)).toEqual(complex(2, -2));
				expect(c.get(2)).toEqual(complex(3, -3));
				expect(c.get(3)).toEqual(complex(4, -4));
				expect(c.get(4)).toEqual(complex(5, -5));
				expect(() => c.get(5)).toThrow("index out of range");

				c.set(0, [10, -10]);
				expect(c.get(0)).toEqual(complex(10, -10));
				expect(c0.get(0)).toEqual(complex(10, -10));
			});

			test("subarray(1)", () => {
				const c0= new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
				const c  = c0.subarray(1);
				expect(c.get(0)).toEqual(complex(2, -2));
				expect(c.get(1)).toEqual(complex(3, -3));
				expect(c.get(2)).toEqual(complex(4, -4));
				expect(c.get(3)).toEqual(complex(5, -5));
				expect(() => c.get(4)).toThrow("index out of range");

				c.set(0, [10, -10]);
				expect(c.get(0)).toEqual(complex(10, -10));
				expect(c0.get(1)).toEqual(complex(10, -10));
			});

			test("subarray(1, 4)", () => {
				const c0= new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
				const c  = c0.subarray(1, 4);
				expect(c.get(0)).toEqual(complex(2, -2));
				expect(c.get(1)).toEqual(complex(3, -3));
				expect(c.get(2)).toEqual(complex(4, -4));
				expect(() => c.get(3)).toThrow("index out of range");

				c.set(0, [10, -10]);
				expect(c.get(0)).toEqual(complex(10, -10));
				expect(c0.get(1)).toEqual(complex(10, -10));
			});
		});

		describe("#reverse", () => {
			test("reverse() odd", () => {
				const c = new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
				const e = new ComplexFloat32Array([ [5, -5], [4, -4], [3, -3], [2, -2], [1, -1] ]);
				c.reverse();
				for (var i = 0, len = e.length; i < len; i++) {
					expect(c.get(i)).toEqual(e.get(i));
				}
			});

			test("reverse() even", () => {
				const c = new ComplexFloat32Array([ [1, -1], [2, -2], [4, -4], [5, -5] ]);
				const e = new ComplexFloat32Array([ [5, -5], [4, -4], [2, -2], [1, -1] ]);
				c.reverse();
				for (var i = 0, len = e.length; i < len; i++) {
					expect(c.get(i)).toEqual(e.get(i));
				}
			})
		});

		describe("#reduce", () => {
			test("#reduce without initial value", () => {
				const c = new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
				const r = c.reduce( (r, i) => r.add(i));
				expect(r).toEqual(complex(15, -15));
			});

			test("#reduce with initial value", () => {
				const c = new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
				const r = c.reduce( (r, i) => r.add(i), complex(0, 0));
				expect(r).toEqual(complex(15, -15));
			});

			test("#reduce with typed initial value", () => {
				const c = new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
				const r = c.reduce( (r, i) => r + i.real, 0);
				expect(r).toBe(15);
			});
		});

		describe("#toString", () => {
			test("toString()", () => {
				const c = new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
				expect(c.toString()).toBe("1-1j,2-2j,3-3j,4-4j,5-5j");
			})
		});
	});
}
