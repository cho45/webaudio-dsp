//#!/usr/bin/env tsc
export type ComplexLike = Complex | number | Array<number>;

export class Complex {
	static readonly ZERO = new Complex(0, 0);
	static readonly ONE = new Complex(1, 0);
	static readonly J = new Complex(0, 1);
	static readonly I = new Complex(0, 1);


	constructor(public real: number, public imag: number) {
		this.real = real;
		this.imag = imag;
		// this is immutable object but Object.freeze slowdown performance
		// Object.freeze(this);
	}

	add(other : ComplexLike) {
		other = Complex.from(other);
		return new Complex(this.real + other.real, this.imag + other.imag);
	}

	sub(other : ComplexLike) {
		other = Complex.from(other);
		return new Complex(this.real - other.real, this.imag - other.imag);
	}

	mul(other : ComplexLike) {
		other = Complex.from(other);
		return new Complex(
			this.real * other.real - this.imag * other.imag,
			this.real * other.imag + this.imag * other.real
		);
	}

	abs() {
		return Math.hypot(this.real, this.imag);
	}

	eq(other : ComplexLike) {
		const s = this.sub(other);
		return Math.abs(s.real) < Number.EPSILON &&  Math.abs(s.imag) < Number.EPSILON;
	}

	angle() {
		return Math.atan2(this.imag, this.real);
	}

	toString() {
		const { real, imag } = this;
		let ret = real.toString(10);
		if (imag === 0) {
			ret += '+0j';
		} else
		if (imag > 0) {
			ret += '+' + imag.toString() + 'j';
		} else {
			ret += imag.toString() + 'j';
		}
		return ret;
	}

	conj() {
		return new Complex(this.real, -this.imag);
	}

	asVec() {
		return [this.real, this.imag];
	}

	static from(v: ComplexLike) {
		if (v instanceof Complex) {
			return v;
		} else
		if (typeof v === 'number') {
			return new Complex(v, 0);
		} else
		if (Array.isArray(v)) {
			return new Complex(v[0], v[1]);
		} else {
			throw `unsupported complex value ${v}`;
		}
	}

	static vec(v: Array<number>) {
		return new Complex(v[0], v[1]);
	}

	static exp(theta: number) {
		return new Complex(Math.cos(theta), Math.sin(theta));
	}
}
