import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import fileUpload, { FileArray } from "express-fileupload";

import { jpgToPdfRoute } from "./routes/jpg-to-pdf";
// import { pdfToJpgRoute } from './routes/pdf-to-jpg';
// import { wordToPdfRoute } from './routes/word-to-pdf';
// import { pdfToWordRoute } from './routes/pdf-to-word';
// import { pptToPdfRoute } from './routes/ppt-to-pdf';
// import { htmlToPdfRoute } from './routes/html-to-pdf';
// import { pdfToPdfaRoute } from './routes/pdf-to-pdfa';
// import { excelToPdfRoute } from './routes/excel-to-pdf';
// import { pdfToExcelRoute } from './routes/pdf-to-excel';
// import { pdfToPptRoute } from './routes/pdf-to-ppt';
// import { compressPdfRoute } from './routes/compress-pdf';
// import { getRoutesHandler } from './routes/get-routes';
// import { mergePdfsRoute } from './routes/merge-pdfs';

const app = express();
const port = 5000;

// enable CORS
app.use(cors());

// files
app.use(fileUpload());

// converter routes
jpgToPdfRoute(app);
// pdfToJpgRoute(app);
// wordToPdfRoute(app);
// pdfToWordRoute(app);
// pptToPdfRoute(app);
// htmlToPdfRoute(app);
// pdfToPdfaRoute(app);
// excelToPdfRoute(app);
// pdfToExcelRoute(app);
// pdfToPptRoute(app);
// compressPdfRoute(app);

// other PDF tool routes
// mergePdfsRoute(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
