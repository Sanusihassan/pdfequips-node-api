import express from "express";
import { Request, Response } from "express";
import { image_to_pdf } from "../tools/converters/img2pdf";
import { validateFile } from "../utils";
export function jpgToPdfRoute(app: express.Application): void {
  app.post("/jpg-to-pdf", async (req: Request, res: Response) => {
    if (!req.files || !req.files.files) {
      return res.status(400).json({ error: "No PDF file provided" });
    }

    const files = Array.isArray(req.files.files)
      ? req.files.files
      : [req.files.files];
    const error = validateFile(files);

    if (error) {
      return res.status(400).json({ error });
    }

    const images = files.map((file) => file.data);
    const pdf = await image_to_pdf(images);

    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);
  });
}
