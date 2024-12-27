// Native bindings
const native = require('../build/Release/tnf_binding.node');

/**
 * Build the project using native Rust implementation
 */
export function build(): void {
  return native.build();
}

/**
 * Update the project using native Rust implementation
 */
export function update(): void {
  return native.update();
}
