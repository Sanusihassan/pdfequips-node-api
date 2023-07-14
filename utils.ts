import { Request, Response, NextFunction } from "express";
import type { UploadedFile } from "express-fileupload";
import mime from "mime-types";

export function isPdf(file: UploadedFile): boolean {
  const mime_type = mime.lookup(file.name);
  file.data = Buffer.from(file.data); // Create a new buffer with the same contents
  file.data = file.data.slice(0); // Extract a portion of the buffer starting from the beginning
  return mime_type === "application/pdf";
}

export function isJpg(file: UploadedFile): boolean {
  const mime_type = mime.lookup(file.name);
  file.data = Buffer.from(file.data); // Create a new buffer with the same contents
  file.data = file.data.slice(0); // Extract a portion of the buffer starting from the beginning
  return mime_type === "image/jpeg";
}

export function isValidWord(file: UploadedFile): boolean {
  if (
    file &&
    file.name &&
    (file.name.endsWith(".doc") || file.name.endsWith(".docx"))
  ) {
    return true;
  } else if (
    file &&
    file.name &&
    (mime.lookup(file.name) === "application/msword" ||
      mime.lookup(file.name) ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
  ) {
    return true;
  } else {
    return false;
  }
}

export function isXls(file: UploadedFile): boolean {
  const header = file.data.slice(0, 5);
  file.data = Buffer.from(file.data); // Create a new buffer with the same contents
  file.data = file.data.slice(0); // Extract a portion of the buffer starting from the beginning
  return header.equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1]));
}

export function isValidExcel(file: UploadedFile): boolean {
  if (
    file &&
    file.name &&
    (file.name.endsWith(".xls") || file.name.endsWith(".xlsx"))
  ) {
    return true;
  } else if (
    file &&
    file.mimetype &&
    (file.mimetype === "application/vnd.ms-excel" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
  ) {
    return true;
  } else {
    return false;
  }
}

export function isValidPowerpoint(file: UploadedFile): boolean {
  if (
    file &&
    file.name &&
    (file.name.endsWith(".ppt") || file.name.endsWith(".pptx"))
  ) {
    return true;
  } else if (
    file &&
    file.mimetype &&
    (file.mimetype === "application/vnd.ms-powerpoint" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation")
  ) {
    return true;
  } else {
    return false;
  }
}

const ALLOWED_EXTENSIONS = new Set([
  "pdf",
  "jpg",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
]);
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export function validateFile(
  files: UploadedFile[] | UploadedFile
): string | null {
  const max_files = 5;
  if (!(files instanceof Array)) {
    files = [files];
  }
  if (files.length > max_files) {
    return "ERR_MAX_FILES_EXCEEDED";
  }
  if (files.length <= 0) {
    return "ERR_NO_FILES_SELECTED";
  }
  for (const file of files) {
    const filename = file.name;

    const extension = filename.split(".").pop();
    if (!file) {
      return "FILE_CORRUPT";
    }
    if (!filename) {
      return "FILE_CORRUPT";
    }
    if (!file.mimetype) {
      return "NOT_SUPPORTED_TYPE";
    }
    const file_contents = file.data;
    if (file_contents.length <= 0) {
      return "EMPTY_FILE";
    }

    // Check file type
    if (extension === undefined) {
      return "NOT_SUPPORTED_TYPE";
    } else if (extension === "pdf" && !isPdf(file)) {
      return "NOT_SUPPORTED_TYPE";
    } else if (extension === "jpg" && !isJpg(file)) {
      return "NOT_SUPPORTED_TYPE";
    } else if (["doc", "docx"].includes(extension) && !isValidWord(file)) {
      return "NOT_SUPPORTED_TYPE";
    } else if (["xls", "xlsx"].includes(extension) && !isValidExcel(file)) {
      return "NOT_SUPPORTED_TYPE";
    } else if (
      ["ppt", "pptx"].includes(extension) &&
      !isValidPowerpoint(file)
    ) {
      console.log("the error is here: isValidPowerpoint(file):");
      return "NOT_SUPPORTED_TYPE";
    }

    if (file_contents.length > MAX_FILE_SIZE) {
      return "FILE_TOO_LARGE";
    }
  }

  return null;
}
