import { Complex, ComplexLike } from './complex';

export abstract class ComplexTypedArray {
	public length: number = 0;

	/**
	 * similar to typedarray[n]
	 * due to performance we do not use array-like proxy interface.
	 */
	abstract get(n: number): Complex;
	/**
	 * similar to typedarray[n] = v;
	 * due to performance we do not use array-like proxy interface.
	 * this is incompatible with TypedArray#set
	 */
	abstract set(index: number, value: ComplexLike): void;
	/**
	 *  similar to typedarray.set(array, offset);
	 */
	abstract setArray(array: ArrayLike<number>, offset: number): void;
	abstract subarray(begin: number, end?:number): ComplexTypedArray
	abstract slice(begin: number, end?:number): ComplexTypedArray
	abstract copyWithin(target: number, start: number, end?: number): void;

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

	reduce( callback: (prev: Complex, curr: Complex, index: number, array: ComplexTypedArray) => Complex) : Complex;
	reduce( callback: (prev: Complex, curr: Complex, index: number, array: ComplexTypedArray) => Complex, initialValue: Complex) : Complex;
	reduce<U>( callback: (prev: U, curr: Complex, index: number, array: ComplexTypedArray) => U, initialValue: U) : U;
	reduce<U>( callback: (prev: U, curr: Complex, index: number, array: ComplexTypedArray) => U, initialValue?: U) : U {
		var i = 0;
		var ret: any;
		if (typeof initialValue === 'undefined') {
			ret = this.get(i++);
		} else {
			ret = initialValue;
		}
		for (var len = this.length; i < len; i++) {
			ret = callback(ret, this.get(i), i, this);
		}
		return ret;
	}

	every( callback: (curr: Complex, index: number, array: ComplexTypedArray) => boolean ): boolean {
		for (var i = 0, len = this.length; i < len; i++) {
			if (callback(this.get(i), i, this)) {
				continue;
			} else {
				return false;
			}
		}
		return true;
	}

	some( callback: (curr: Complex, index: number, array: ComplexTypedArray) => boolean ): boolean {
		for (var i = 0, len = this.length; i < len; i++) {
			if (callback(this.get(i), i, this)) {
				return true;
			} else {
				continue;
			}
		}
		return false;
	}

	filter( callback: (curr: Complex, index: number, array: ComplexTypedArray) => boolean ): ComplexTypedArray {
		const ret = [];
		for (var i = 0, len = this.length; i < len; i++) {
			const item = this.get(i);
			if (callback(item, i, this)) {
				ret.push(item);
			}
		}
		return new (this.constructor as any)(ret);
	}

	findIndex( callback: (curr: Complex, index: number, array: ComplexTypedArray) => boolean ): number | undefined {
		for (var i = 0, len = this.length; i < len; i++) {
			const item = this.get(i);
			if (callback(item, i, this)) {
				return i;
			}
		}
		return undefined;
	}

	find( callback: (curr: Complex, index: number, array: ComplexTypedArray) => boolean ): Complex | undefined {
		const index = this.findIndex(callback);
		if (typeof index !== 'undefined') {
			return this.get(index);
		}
		return undefined;
	}

	forEach( callback: (curr: Complex, index: number, array: ComplexTypedArray) => boolean ): void {
		for (var i = 0, len = this.length; i < len; i++) {
			const item = this.get(i);
			callback(item, i, this);
		}
	}

	includes(e: ComplexLike, fromIndex?: number): boolean {
		const index = this.indexOf(e, fromIndex);
		return index !== -1;
	}

	indexOf(e: ComplexLike, fromIndex?: number): number {
		if (typeof fromIndex === 'undefined') {
			fromIndex = 0;
		}
		e = Complex.from(e);
		for (var i = fromIndex, len = this.length; i < len; i++) {
			const item = this.get(i);
			if (e.eq(item)) {
				return i;
			}
		}
		return -1;
	}

	lastIndexOf(e: ComplexLike, fromIndex?: number): number {
		if (typeof fromIndex === 'undefined') {
			fromIndex = this.length;
		}
		e = Complex.from(e);
		for (var i = fromIndex - 1; i > 0; i--) {
			const item = this.get(i);
			if (e.eq(item)) {
				return i;
			}
		}
		return -1;
	}

	join(sep: string): string {
		return Array.from(this).join(sep);
	}

	sort( fun: (a: Complex, b: Complex) => number): ComplexTypedArray {
		return new (this.constructor as any)(Array.from(this).sort(fun));
	}

	reverse() {
		for (let i = 0, len = this.length, N = (this.length / 2)|0; i < N; i++) {
			const a = this.get(i);
			const b = this.get(len - i - 1);
			this.set(i, b);
			this.set(len - i - 1, a);
		}
		return this;
	}

	*entries(): IterableIterator<[number, Complex]> {
		for (var i = 0, len = this.length; i < len; i++) {
			yield [i, this.get(i)];
		}
	}

	*values() {
		for (var i = 0, len = this.length; i < len; i++) {
			yield this.get(i);
		}
	}

	*keys() {
		for (var i = 0, len = this.length; i < len; i++) {
			yield i;
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
		const { array } = this;
		const real = array[n*2];
		const imag = array[n*2+1];
		return new Complex(real, imag);
	}

	copyWithin(target: number, start: number, end?: number) {
		if (typeof end === 'undefined') end = this.length;
		this.array.copyWithin(target * 2, start * 2, end * 2);
	}

	set(index: number, value: ComplexLike) {
		const { array } = this;
		value = Complex.from(value);
		array[index*2]  = value.real;
		array[index*2+1] = value.imag;
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


