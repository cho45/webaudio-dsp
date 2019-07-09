import { Complex } from './complex';
import { ComplexTypedArray } from './complex-typedarray';

export class FFT {
	N: number;
	rev: Uint32Array;
	f: Array<Array<Complex>>
	b: Array<Array<Complex>>

	constructor(N: number) {
		this.N = N;

		const k = Math.log2(N);
		const rev = new Uint32Array(N);
		for (let i = 0; i < N; i++) {
			let r = 0;
			for (let j = 0; j < k; j++) r = (r << 1) | ((i >>> j) & 1);
			rev[i] = r;
		}
		this.rev = rev;

		this.f = [];
		this.b = [];
		let T = -2 * Math.PI;
		for (let Nh = 1; Nh < N; Nh *= 2) {
			T /= 2;
			this.f[Nh] = [];
			this.b[Nh] = [];
			for (let i = 0; i < Nh; i++) {
				const c = Complex.exp( T * i);
				this.f[Nh][i] = c;
				this.b[Nh][i] = c.conj();
			}
		}
	}

	fft(f: ComplexTypedArray) {
		return this.fftin(f, -1);
	}

	ifft(f: ComplexTypedArray) {
		const N = this.N;
		return this.fftin(f, +1).map((c) => [c.real / N, c.imag / N]);
	}

	/**
	 * based on https://qiita.com/bellbind/items/ba7aa07f6c915d400000
	 */
	fftin(c: ComplexTypedArray, dir: number) {
		let { N, rev, f, b } = this;

		const e = dir === 1 ? b : f;

		const rec = c.map((_, i) => c.get(rev[i]));
		for (let Nh = 1; Nh < N; Nh *= 2) {
			for (let s = 0; s < N; s += Nh * 2) {
				for (let i = 0; i < Nh; i++) {
					const l = rec.get(s + i);
					const re = rec.get(s + i + Nh).mul(e[Nh][i]);
					rec.set(s + i, l.add(re));
					rec.set(s + i + Nh, l.sub(re));
				}
			}
		}
		return rec;
	}
}

