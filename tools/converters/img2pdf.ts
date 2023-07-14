import { createWriteStream } from "fs";
import { promisify } from "util";
import PDFDocument from "pdfkit";
import { Image } from "image-js";
import { isJpg } from "../../utils";

async function image_to_pdf(images: Buffer[]): Promise<Buffer> {
  const pdfBuffers: Buffer[] = [];

  for (const image of images) {
    const img = await Image.load(image);
    const [width, height] = [img.width, img.height];

    const doc = new PDFDocument({ autoFirstPage: false });
    const stream = doc.pipe(createWriteStream("output.pdf"));
    doc.addPage({ size: [width, height] });
    doc.image(image, 0, 0, { width, height });
    doc.end();

    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const buffers: Uint8Array[] = [];
      stream.on("data", (buffer) => buffers.push(buffer));
      stream.on("end", () => resolve(Buffer.concat(buffers)));
      stream.on("error", (error) => reject(error));
    });

    pdfBuffers.push(pdfBuffer);
  }

  return Buffer.concat(pdfBuffers);
}

export { image_to_pdf };
