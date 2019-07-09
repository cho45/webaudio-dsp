#!/usr/bin/env node

const { complex } = require('./dist-cjs/src/complex.js');

console.log(complex(1, 2)); //=> Complex { real: 1, imag: 2 }

const { ComplexFloat32DoubledArray, ComplexFloat32InterleavedArray } = require('./dist-cjs/src/complex-typedarray.js');

// interleaved is faster than doubled
// but you can use doubled for existing double typedarrays.
const interleaved = new ComplexFloat32InterleavedArray([1, 2, 3]);
console.log(interleaved);
//==> ComplexFloat32InterleavedArray { length: 3, array: Float32Array [ 1, 0, 2, 0, 3, 0 ] }
console.log(interleaved.get(0)); //=> Complex { real: 1, imag: 0 }

const doubled = new ComplexFloat32DoubledArray([1, 2, 3]);
console.log(doubled);
//=> ComplexFloat32DoubledArray { length: 3, real: Float32Array [ 1, 2, 3 ], imag: Float32Array [ 0, 0, 0 ] }
