import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const prompt =
  'Extraia os dados dessa imagem. Os seguintes dados serão extraídos: 1)Produto. É uma informação única. Um produto possui um id e um nome, situado no início da imagem. Exemplo: id: "02004" nome: "MP-05 POSTURA INTENSIVA 17% F". 2) Macro ingredientes. Podem haver múltiplos Macro ingredientes. Cada macro ingrediente possui ID, NOME e QUANTIDADE(KG). Nesse quadro, as informações virão nessas ordem: ID -> NOME -> QUANTIDADE. Exemplo: 000001  MILHO  987,000. 3) Micro ingredientes. Podem haver múltiplos Micro ingredientes. Cada micro ingrediente possui ID, NOME e QUANTIDADE(KG). Nesse quadro, as informações virão nessas ordem: ID -> NOME -> QUANTIDADE. Exemplo: 000141  SAL  7,500. 4) Outros. Podem haver múltiplos outros. Este dado pode ou não estar presente. Se não houver, apenas omita o item 4) do output. Cada outro possui ID, NOME e QUANTIDADE(KG). Nesse quadro, as informações virão nessas ordem: ID -> NOME -> QUANTIDADE. Exemplo: 0000131  MELAÇO  100,000. O Output deve ser como o seguinte exemplo: 1)id:02004|nome:MP-05 POSTURA INTENSIVA 17% F|2)id:000001|nome:MILHO|quantidade:987,000|id:00031|nome:FARELO DE TRIGO|quantidade:400,000|3)id:00257|nome:PX 05 POSTURA PRODUÇAO|quantidade:8,000|id:00141|nome:SAL|quantidade:7,000|4)id:00131|nome:MELACO|quantidade:30,000';

const image = {
  inlineData: {
    data: req.file.buffer.toString('base64'),
    mimeType: req.file.mimetype,
  },
};

const result = await model.generateContent([prompt, image]);
const text = await result.response.text();
