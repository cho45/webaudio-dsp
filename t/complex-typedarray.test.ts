//#!/usr/bin/env npx jest

import { Complex } from "../src/complex";
import { ComplexFloat32DoubledArray, ComplexFloat32InterleavedArray } from '../src/complex-typedarray';

describe("ComplexFloat32InterleavedArray", () => {
	const ComplexFloat32Array = ComplexFloat32InterleavedArray;
	describe("new ComplexFloat32InterleavedArray", () => {
		test("ComplexFloat32InterleavedArray from real array", () => {
			const c = new ComplexFloat32Array([1, 2, 3, 4, 5]);
			expect(c.get(0)).toEqual(new Complex(1, 0));
		});

		test("ComplexFloat32InterleavedArray from complex-likearray", () => {
			const c = new ComplexFloat32Array([ [1, 2], [3, 4] ]);
			expect(c.get(0)).toEqual(new Complex(1, 2));
			expect(c.get(1)).toEqual(new Complex(3, 4));
		});

		test("ComplexFloat32InterleavedArray with length", () => {
			const c = new ComplexFloat32Array(3);
			expect(c.get(0)).toEqual(new Complex(0, 0));
			expect(c.get(1)).toEqual(new Complex(0, 0));
			expect(c.get(2)).toEqual(new Complex(0, 0));
			expect(() => c.get(3)).toThrow("index out of range");
		});
	});

	describe("ComplexFloat32InterleavedArray#get", () => {
		test("get", () => {
			const c = new ComplexFloat32Array(3);
			expect(c.get(0)).toEqual(new Complex(0, 0));
			expect(c.get(1)).toEqual(new Complex(0, 0));
			expect(c.get(2)).toEqual(new Complex(0, 0));
			expect(() => c.get(3)).toThrow("index out of range");
		});
	});

	describe("ComplexFloat32InterleavedArray#set", () => {
		test("set(index, value)", () => {
			const c = new ComplexFloat32Array(3);
			c.set(0, [10, -10]);

			expect(c.get(0)).toEqual(new Complex(10, -10));
		});
	});

	describe("ComplexFloat32InterleavedArray#setArray", () => {
		test("set(array, offset)", () => {
			const c = new ComplexFloat32Array(3);
			c.setArray([1, 2, 3], 1);

			expect(c.get(0)).toEqual(new Complex(0, 0));
			expect(c.get(1)).toEqual(new Complex(1, 0));
			expect(c.get(2)).toEqual(new Complex(2, 0));
		});
	});

	describe("ComplexFloat32InterleavedArray#copyWithIn", () => {
		test("1", () => {
			const c = new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
			c.copyWithin(1, 0);
			expect(c.get(0)).toEqual(new Complex(1, -1));
			expect(c.get(1)).toEqual(new Complex(1, -1));
			expect(c.get(2)).toEqual(new Complex(2, -2));
			expect(c.get(3)).toEqual(new Complex(3, -3));
			expect(c.get(4)).toEqual(new Complex(4, -4));
			expect(() => c.get(5)).toThrow("index out of range");
		});
		test("2", () => {
			const c = new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
			c.copyWithin(2, 0);
			expect(c.get(0)).toEqual(new Complex(1, -1));
			expect(c.get(1)).toEqual(new Complex(2, -2));
			expect(c.get(2)).toEqual(new Complex(1, -1));
			expect(c.get(3)).toEqual(new Complex(2, -2));
			expect(c.get(4)).toEqual(new Complex(3, -3));
			expect(() => c.get(5)).toThrow("index out of range");
		});
	});

	describe("ComplexFloat32InterleavedArray#subarray", () => {
		test("subarray(0)", () => {
			const c0= new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
			const c  = c0.subarray(0);
			expect(c.get(0)).toEqual(new Complex(1, -1));
			expect(c.get(1)).toEqual(new Complex(2, -2));
			expect(c.get(2)).toEqual(new Complex(3, -3));
			expect(c.get(3)).toEqual(new Complex(4, -4));
			expect(c.get(4)).toEqual(new Complex(5, -5));
			expect(() => c.get(5)).toThrow("index out of range");

			c.set(0, [10, -10]);
			expect(c.get(0)).toEqual(new Complex(10, -10));
			expect(c0.get(0)).toEqual(new Complex(10, -10));
		});

		test("subarray(1)", () => {
			const c0= new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
			const c  = c0.subarray(1);
			expect(c.get(0)).toEqual(new Complex(2, -2));
			expect(c.get(1)).toEqual(new Complex(3, -3));
			expect(c.get(2)).toEqual(new Complex(4, -4));
			expect(c.get(3)).toEqual(new Complex(5, -5));
			expect(() => c.get(4)).toThrow("index out of range");

			c.set(0, [10, -10]);
			expect(c.get(0)).toEqual(new Complex(10, -10));
			expect(c0.get(1)).toEqual(new Complex(10, -10));
		});

		test("subarray(1, 4)", () => {
			const c0= new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
			const c  = c0.subarray(1, 4);
			expect(c.get(0)).toEqual(new Complex(2, -2));
			expect(c.get(1)).toEqual(new Complex(3, -3));
			expect(c.get(2)).toEqual(new Complex(4, -4));
			expect(() => c.get(3)).toThrow("index out of range");

			c.set(0, [10, -10]);
			expect(c.get(0)).toEqual(new Complex(10, -10));
			expect(c0.get(1)).toEqual(new Complex(10, -10));
		});
	});

	describe("ComplexFloat32InterleavedArray#toString", () => {
		test("toString()", () => {
			const c = new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
			expect(c.toString()).toBe("1-1j,2-2j,3-3j,4-4j,5-5j");
		})
	});
});

describe("ComplexFloat32DoubledArray", () => {
	const ComplexFloat32Array = ComplexFloat32DoubledArray;
	describe("new ComplexFloat32DoubledArray", () => {
		test("ComplexFloat32DoubledArray from real array", () => {
			const c = new ComplexFloat32Array([1, 2, 3, 4, 5]);
			expect(c.get(0)).toEqual(new Complex(1, 0));
		});

		test("ComplexFloat32DoubledArray from complex-likearray", () => {
			const c = new ComplexFloat32Array([ [1, 2], [3, 4] ]);
			expect(c.get(0)).toEqual(new Complex(1, 2));
			expect(c.get(1)).toEqual(new Complex(3, 4));
		});

		test("ComplexFloat32DoubledArray with length", () => {
			const c = new ComplexFloat32Array(3);
			expect(c.get(0)).toEqual(new Complex(0, 0));
			expect(c.get(1)).toEqual(new Complex(0, 0));
			expect(c.get(2)).toEqual(new Complex(0, 0));
			expect(() => c.get(3)).toThrow("index out of range");
		});
	});

	describe("ComplexFloat32DoubledArray#get", () => {
		test("get", () => {
			const c = new ComplexFloat32Array(3);
			expect(c.get(0)).toEqual(new Complex(0, 0));
			expect(c.get(1)).toEqual(new Complex(0, 0));
			expect(c.get(2)).toEqual(new Complex(0, 0));
			expect(() => c.get(3)).toThrow("index out of range");
		});
	});

	describe("ComplexFloat32DoubledArray#set", () => {
		test("set(index, value)", () => {
			const c = new ComplexFloat32Array(3);
			c.set(0, [10, -10]);

			expect(c.get(0)).toEqual(new Complex(10, -10));
		});
	});

	describe("ComplexFloat32DoubledArray#setArray", () => {
		test("set(array, offset)", () => {
			const c = new ComplexFloat32Array(3);
			c.setArray([1, 2, 3], 1);

			expect(c.get(0)).toEqual(new Complex(0, 0));
			expect(c.get(1)).toEqual(new Complex(1, 0));
			expect(c.get(2)).toEqual(new Complex(2, 0));
		});
	});

	describe("ComplexFloat32DoubledArray#copyWithIn", () => {
		test("1", () => {
			const c = new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
			c.copyWithin(1, 0);
			expect(c.get(0)).toEqual(new Complex(1, -1));
			expect(c.get(1)).toEqual(new Complex(1, -1));
			expect(c.get(2)).toEqual(new Complex(2, -2));
			expect(c.get(3)).toEqual(new Complex(3, -3));
			expect(c.get(4)).toEqual(new Complex(4, -4));
			expect(() => c.get(5)).toThrow("index out of range");
		});
		test("2", () => {
			const c = new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
			c.copyWithin(2, 0);
			expect(c.get(0)).toEqual(new Complex(1, -1));
			expect(c.get(1)).toEqual(new Complex(2, -2));
			expect(c.get(2)).toEqual(new Complex(1, -1));
			expect(c.get(3)).toEqual(new Complex(2, -2));
			expect(c.get(4)).toEqual(new Complex(3, -3));
			expect(() => c.get(5)).toThrow("index out of range");
		});
	});

	describe("ComplexFloat32DoubledArray#subarray", () => {
		test("subarray(0)", () => {
			const c0= new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
			const c  = c0.subarray(0);
			expect(c.get(0)).toEqual(new Complex(1, -1));
			expect(c.get(1)).toEqual(new Complex(2, -2));
			expect(c.get(2)).toEqual(new Complex(3, -3));
			expect(c.get(3)).toEqual(new Complex(4, -4));
			expect(c.get(4)).toEqual(new Complex(5, -5));
			expect(() => c.get(5)).toThrow("index out of range");

			c.set(0, [10, -10]);
			expect(c.get(0)).toEqual(new Complex(10, -10));
			expect(c0.get(0)).toEqual(new Complex(10, -10));
		});

		test("subarray(1)", () => {
			const c0= new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
			const c  = c0.subarray(1);
			expect(c.get(0)).toEqual(new Complex(2, -2));
			expect(c.get(1)).toEqual(new Complex(3, -3));
			expect(c.get(2)).toEqual(new Complex(4, -4));
			expect(c.get(3)).toEqual(new Complex(5, -5));
			expect(() => c.get(4)).toThrow("index out of range");

			c.set(0, [10, -10]);
			expect(c.get(0)).toEqual(new Complex(10, -10));
			expect(c0.get(1)).toEqual(new Complex(10, -10));
		});

		test("subarray(1, 4)", () => {
			const c0= new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
			const c  = c0.subarray(1, 4);
			expect(c.get(0)).toEqual(new Complex(2, -2));
			expect(c.get(1)).toEqual(new Complex(3, -3));
			expect(c.get(2)).toEqual(new Complex(4, -4));
			expect(() => c.get(3)).toThrow("index out of range");

			c.set(0, [10, -10]);
			expect(c.get(0)).toEqual(new Complex(10, -10));
			expect(c0.get(1)).toEqual(new Complex(10, -10));
		});
	});

	describe("ComplexFloat32DoubledArray#toString", () => {
		test("toString()", () => {
			const c = new ComplexFloat32Array([ [1, -1], [2, -2], [3, -3], [4, -4], [5, -5] ]);
			expect(c.toString()).toBe("1-1j,2-2j,3-3j,4-4j,5-5j");
		})
	});
});
