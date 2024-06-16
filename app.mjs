//const dummyRouter = require('./routers/dummyRouter');

import express from 'express';
import morgan from 'morgan';
import upload from './utils/multerUpload.mjs';
import AppError from './utils/appError.mjs';
import globalErrorHandler from './controllers/errorController.mjs';
import catchAsync from './utils/catchAsync.mjs';
import * as mupdf from 'mupdf';
import { GoogleGenerativeAI } from '@google/generative-ai';
const app = express();

app.use(express.json({ limit: '10kb' }));

app.use(morgan('dev'));

app.post(
  '/teste',
  upload.single('image'),
  catchAsync(async (req, res, next) => {
    const doc = mupdf.Document.openDocument(req.file.buffer, 'application/pdf');
    const count = doc.countPages();
    const page = doc.loadPage(15);

    const pixmap = page.toPixmap(
      mupdf.Matrix.identity,
      mupdf.ColorSpace.DeviceRGB,
      false,
      false
    );

    const pngImage = pixmap.asPNG();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt =
      'Extraia os dados dessa imagem. Os seguintes dados serão extraídos: 1)Produto. É uma informação única. Um produto possui um id e um nome, situado no início da imagem. Exemplo: id: "02004" nome: "MP-05 POSTURA INTENSIVA 17% F". 2) Macro ingredientes. Podem haver múltiplos Macro ingredientes. Cada macro ingrediente possui ID, NOME e QUANTIDADE(KG). Nesse quadro, as informações virão nessas ordem: ID -> NOME -> QUANTIDADE. Exemplo: 000001  MILHO  987,000. 3) Micro ingredientes. Podem haver múltiplos Micro ingredientes. Cada micro ingrediente possui ID, NOME e QUANTIDADE(KG). Nesse quadro, as informações virão nessas ordem: ID -> NOME -> QUANTIDADE. Exemplo: 000141  SAL  7,500. 4) Outros. Podem haver múltiplos outros. Este dado pode ou não estar presente. Se não houver, apenas omita o item 4) do output. Cada outro possui ID, NOME e QUANTIDADE(KG). Nesse quadro, as informações virão nessas ordem: ID -> NOME -> QUANTIDADE. Exemplo: 0000131  MELAÇO  100,000. O Output deve ser como o seguinte exemplo: 1)id:02004|nome:MP-05 POSTURA INTENSIVA 17% F|2)id:000001|nome:MILHO|quantidade:987,000|id:00031|nome:FARELO DE TRIGO|quantidade:400,000|3)id:00257|nome:PX 05 POSTURA PRODUÇAO|quantidade:8,000|id:00141|nome:SAL|quantidade:7,000|4)id:00131|nome:MELACO|quantidade:30,000';

    const image = {
      inlineData: {
        data: Buffer.from(pngImage).toString('base64'),
        mimeType: 'image/png',
      },
    };

    const result = await model.generateContent([prompt, image]);
    const text = await result.response.text();

    res.status(200).json({
      status: 'success',
      data: {
        text: text,
      },
    });
  })
);

//app.use('/api/v1/dummy', dummyRouter);

app.all('/api/v1/*', (req, res, next) => {
  next(new AppError(`Could not find ${req.originalUrl} in this server`, 404));
});

app.use(globalErrorHandler);

export default app;
