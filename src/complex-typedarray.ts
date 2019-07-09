import { Complex, ComplexLike } from './complex';

export abstract class ComplexTypedArray {
	public length: number = 0;

	abstract get(n: number): Complex;
	abstract set(index: number, value: ComplexLike): void;
	abstract setArray(array: ArrayLike<number>, offset: number): void;
	abstract subarray(begin: number, end?:number): ComplexTypedArray
	abstract slice(begin: number, end?:number): ComplexTypedArray

	*[Symbol.iterator]() {
		for (var i = 0, len = this.length; i < len; i++) {
			yield this.get(i);
		}
	}

	map(f: (item: Complex, index: number) => ComplexLike) {
		const ret: ComplexTypedArray = new (this.constructor as any)(this.length);
		for (var i = 0, len = this.length; i < len; i++) {
			ret.set(i, Complex.from(f(this.get(i), i)));
		}
		return ret;
	}

	fill(value: ComplexLike, start: number, end?: number) {
		if (typeof end === 'undefined') {
			end = this.length;
		}
		for (let i = start; i < end; i++) {
			this.set(i, value);
		}
	}

	*entries() {
		for (var i = 0, len = this.length; i < len; i++) {
			yield [i, this.get(i)];
		}
	}

	*values() {
		for (var i = 0, len = this.length; i < len; i++) {
			yield this.get(i);
		}
	}

	toString() {
		let str = this.get(0).toString();
		for (var i = 1, len = this.length; i < len; i++) {
			str += "," + this.get(i).toString();
		}
		return str;
	}
}

export class ComplexFloat32DoubledArray extends ComplexTypedArray {
	real: Float32Array;
	imag: Float32Array;

	constructor(n: Array<ComplexLike>);
	constructor(n: number);
	constructor(n: { real: Float32Array; imag: Float32Array; });
	constructor(n: any) {
		super();
		if (typeof n === 'number') {
			this.real = new Float32Array(n);
			this.imag = new Float32Array(n);
		} else {
			n = Object(n);
			if (n.real && n.imag) {
				this.real = n.real;
				this.imag = n.imag;
			} else 
			if (Array.isArray(n)) {
				this.real = new Float32Array(n.length);
				this.imag = new Float32Array(n.length);
				for (var i = 0, len = n.length; i < len; i++) {
					[ this.real[i], this.imag[i] ] = Complex.from(n[i]).asVec();
				}
			} else {
				throw "unsupported type of constructor argument";
			}
		}

		this.length = this.real.length;
	}

	get(index: number) {
		if (index >= this.length) {
			throw RangeError("index out of range");
		}
		return new Complex(this.real[index], this.imag[index]);
	}

	set(index: any, value: any) {
		[ this.real[index], this.imag[index] ] = Complex.from(value).asVec();
	}

	setArray(array: ArrayLike<ComplexLike>, offset: number) {
		if (array instanceof ComplexFloat32DoubledArray) {
			this.real.set(array.real, offset);
			this.imag.set(array.imag, offset);
		} else {
			for (var i = offset, len = this.length; i < len; i++) {
				[ this.real[i], this.imag[i] ] = Complex.from(array[i-offset]).asVec();
			}
		}
	}

	copyWithin(target: number, start: number, end?: number) {
		this.real.copyWithin(target, start, end);
		this.imag.copyWithin(target, start, end);
	}

	slice(begin: number, end?: number) {
		if (typeof end === 'undefined') {
			end = this.length;
		}
		return new ComplexFloat32DoubledArray({
			real: this.real.slice(begin, end),
			imag: this.imag.slice(begin, end),
		});
	}

	subarray(begin: number, end?: number) {
		if (typeof end === 'undefined') {
			end = this.length;
		}
		return new ComplexFloat32DoubledArray({
			real: this.real.subarray(begin, end),
			imag: this.imag.subarray(begin, end),
		});
	}

	asComplexArray() {
		return Array.from(this);
	}
}

export class ComplexFloat32InterleavedArray extends ComplexTypedArray {
	array: Float32Array;

	constructor(n: number | ArrayBuffer | Array<ComplexLike>, byteOffset?: number, length?: number) {
		super();
		if (typeof n === 'number') {
			this.array = new Float32Array(n * 2);
		} else 
		if (n instanceof ArrayBuffer) {
			this.array = new Float32Array(n, byteOffset || 0, length || 0);
		} else
		if (Array.isArray(n)) {
			this.array = new Float32Array(n.length * 2);
			for (var i = 0, len = n.length; i < len; i++) {
				[ this.array[i*2], this.array[i*2+1] ] = Complex.from(n[i]).asVec();
			}
		} else {
			throw "unsupported type of constructor argument";
		}

		this.length = this.array.length / 2;
	}

	get(n: number) {
		if (n >= this.length) {
			throw RangeError("index out of range");
		}
		const real = this.array[n*2];
		const imag = this.array[n*2+1];
		return new Complex(real, imag);
	}

	copyWithin(target: number, start: number, end?: number) {
		if (typeof end === 'undefined') end = this.length;
		this.array.copyWithin(target * 2, start * 2, end * 2);
	}

	set(index: number, value: ComplexLike) {
		// faster than this.array.set(Complex.from(value).asVec(), index*2);
		[ this.array[index*2], this.array[index*2+1] ] = Complex.from(value).asVec()
	}

	setArray(array: ArrayLike<ComplexLike>, offset: number) {
		if (array instanceof ComplexFloat32InterleavedArray) {
			this.array.set(array.array, offset*2);
		} else {
			for (var i = offset, len = this.length; i < len; i++) {
				[ this.array[i*2], this.array[i*2+1] ] = Complex.from(array[i-offset]).asVec();
			}
		}
	}

	subarray(begin: number, end?: number) {
		if (typeof end === 'undefined') {
			end = this.length;
		}

		return new ComplexFloat32InterleavedArray( this.array.buffer, begin * 2 * Float32Array.BYTES_PER_ELEMENT, (end - begin) * 2 );
	}

	slice(begin: number, end?: number) {
		return new ComplexFloat32InterleavedArray(Array.from(this.subarray(begin, end)));
	}

	asComplexArray() {
		return Array.from(this);
	}
}


