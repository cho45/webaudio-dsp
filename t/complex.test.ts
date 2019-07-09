//#!/usr/bin/env npx jest

import { Complex } from "../src/complex";

test("instanciate", () => {
	const c = new Complex(1, 2);
	expect(c.real).toBe(1);
	expect(c.imag).toBe(2);
});

describe("Complex.from", () => {
	test("from(Complex)", () => {
		const c = Complex.from(Complex.ZERO);
		expect(c).toBe(Complex.ZERO);
	});

	test("from(number)", () => {
		const c = Complex.from(1);
		expect(c.real).toBe(1);
		expect(c.imag).toBe(0);
	});

	test("from([real, imag])", () => {
		const c = Complex.from([1, 2]);
		expect(c.real).toBe(1);
		expect(c.imag).toBe(2);
	});

//	test("from(invalid)", () => {
//		expect( () =>  Complex.from(undefined) ).toThrow("unsupported complex value");
//	});
});

describe("Complex.vec", () => {
	test("vec([real, imag]", () => {
		const c = Complex.vec([1, 2]);
		expect(c.real).toBe(1);
		expect(c.imag).toBe(2);
	});
});

describe("Complex.exp", () => {
	test("exp(theta)", () => {
		const theta = 1;
		const c = Complex.exp(theta);
		expect(c.real).toBeCloseTo(Math.cos(theta));
		expect(c.imag).toBeCloseTo(Math.sin(theta));
	});
});

describe("Complex#add", () => {
	test("add(Complex)", () => {
		const c = Complex.from([1, 2]).add(Complex.from([3, 4]));
		expect(c.real).toBe(4);
		expect(c.imag).toBe(6);
	});

	test("add(number)", () => {
		const c = Complex.from([1, 2]).add(1);
		expect(c.real).toBe(2);
		expect(c.imag).toBe(2);
	});

	test("add([real, imag])", () => {
		const c = Complex.from([1, 2]).add([3, 4]);
		expect(c.real).toBe(4);
		expect(c.imag).toBe(6);
	});
});

describe("Complex#sub", () => {
	test("sub(Complex)", () => {
		const c = Complex.from([1, 2]).sub(Complex.from([3, 6]));
		expect(c.real).toBe(-2);
		expect(c.imag).toBe(-4);
	});

	test("sub(number)", () => {
		const c = Complex.from([1, 2]).sub(1);
		expect(c.real).toBe(0);
		expect(c.imag).toBe(2);
	});

	test("sub([real, imag])", () => {
		const c = Complex.from([1, 2]).sub([3, 6]);
		expect(c.real).toBe(-2);
		expect(c.imag).toBe(-4);
	});
});

describe("Complex#mul", () => {
	test("mul(Complex)", () => {
		const c = Complex.from([1, 2]).mul(Complex.from([3, 6]));
		expect(c.real).toBe(-9);
		expect(c.imag).toBe(12);
	});

	test("mul(number)", () => {
		const c = Complex.from([1, 2]).mul(2);
		expect(c.real).toBe(2);
		expect(c.imag).toBe(4);
	});

	test("mul([real, imag])", () => {
		const c = Complex.from([1, 2]).mul([3, 6]);
		expect(c.real).toBe(-9);
		expect(c.imag).toBe(12);
	});

	test("mul([real, imag])", () => {
		const c = Complex.from([2, 3]).mul([4, 5]);
		expect(c.real).toBe(-7);
		expect(c.imag).toBe(22);
	});
});

describe("Complex#div", () => {
	test("mul([real, imag])", () => {
		const c = Complex.from([2, 3]).div([4, 5]);
		expect(c.real).toBeCloseTo(0.5609756098);
		expect(c.imag).toBeCloseTo(0.04878048781);
	});
});

describe("Complex#eq", () => {
	test("eq(Complex)", () => {
		expect(Complex.from([1, 2]).eq(Complex.from([1, 2]))).toBe(true);
		expect(Complex.from([1, 2]).eq(Complex.from([1, 3]))).toBe(false);
		expect(Complex.from([1, 2]).eq(Complex.from([2, 2]))).toBe(false);
	});
	test("eq(number)", () => {
		expect(Complex.from([1, 0]).eq(1)).toBe(true);
		expect(Complex.from([1, 1]).eq(1)).toBe(false);
		expect(Complex.from([0, 0]).eq(1)).toBe(false);
	});
});

describe("Complex#conj", () => {
	test("conj", () => {
		expect(Complex.from([1, 2]).conj()).toEqual(new Complex(1, -2));
		expect(Complex.from([1, 2]).conj().conj()).toEqual(new Complex(1, 2));
	});
});

describe("Complex#abs", () => {
	test("abs", () => {
		expect(Complex.from([2, 2]).abs()).toBeCloseTo(Math.hypot(2, 2));
		expect(Complex.from([-2, -2]).abs()).toBeCloseTo(Math.hypot(-2, -2));
	});
});

describe("Complex#angle", () => {
	test("angle", () => {
		expect(Complex.from([2, 2]).angle()).toBeCloseTo(Math.atan2(2, 2));
		expect(Complex.from([-2, -2]).angle()).toBeCloseTo(Math.atan2(-2, -2));
	});
});

describe("Complex#toString", () => {
	test("toString", () => {
		expect(Complex.from([1, 2]).toString()).toBe("1+2j");
		expect(Complex.from([1, 0]).toString()).toBe("1+0j");
		expect(Complex.from([0, 0]).toString()).toBe("0+0j");
		expect(Complex.from([1, -2]).toString()).toBe("1-2j");
	});
});

describe("Complex constants", () => {
	test("Complex.ZERO", () => {
		expect(Complex.ZERO.real).toBe(0);
		expect(Complex.ZERO.imag).toBe(0);
	});
	test("Complex.ONE", () => {
		expect(Complex.ONE.real).toBe(1);
		expect(Complex.ONE.imag).toBe(0);
	});
	test("Complex.J", () => {
		expect(Complex.J.real).toBe(0);
		expect(Complex.J.imag).toBe(1);
	});
	test("Complex.I", () => {
		expect(Complex.I.real).toBe(0);
		expect(Complex.I.imag).toBe(1);
	});
});
