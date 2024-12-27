use napi::bindgen_prelude::*;
use napi_derive::napi;
use tnf;

#[napi]
pub fn build() -> Result<()> {
    // Call your Rust logic in the tnf crate
    tnf::build();
    Ok(())
}

#[napi]
pub fn update() -> Result<()> {
    tnf::update();
    Ok(())
}
