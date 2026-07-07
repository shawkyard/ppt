use base64::{engine::general_purpose::STANDARD, Engine as _};
use image::{ImageBuffer, Rgba};
use std::io::Cursor;

/// Read an image currently on the system clipboard and return it as a
/// base64-encoded PNG string. The frontend decodes this and writes the bytes
/// to the app's local screenshots directory via the fs plugin.
///
/// Returns `Ok(None)` when the clipboard holds no image (e.g. it only has
/// text), so the UI can show a friendly "no image found" message instead of
/// treating it as an error.
#[tauri::command]
fn read_clipboard_image() -> Result<Option<String>, String> {
    let mut clipboard = arboard::Clipboard::new().map_err(|e| e.to_string())?;

    let img = match clipboard.get_image() {
        Ok(img) => img,
        // arboard returns ContentNotAvailable when there is no image.
        Err(arboard::Error::ContentNotAvailable) => return Ok(None),
        Err(e) => return Err(e.to_string()),
    };

    let width = img.width as u32;
    let height = img.height as u32;

    let buffer: ImageBuffer<Rgba<u8>, Vec<u8>> =
        ImageBuffer::from_raw(width, height, img.bytes.into_owned())
            .ok_or_else(|| "clipboard image buffer had an unexpected size".to_string())?;

    let mut png_bytes: Vec<u8> = Vec::new();
    buffer
        .write_to(&mut Cursor::new(&mut png_bytes), image::ImageFormat::Png)
        .map_err(|e| e.to_string())?;

    Ok(Some(STANDARD.encode(&png_bytes)))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![read_clipboard_image])
        .run(tauri::generate_context!())
        .expect("error while running PromptShot");
}
