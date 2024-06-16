import multer from 'multer';
import AppError from './appError.mjs';
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/'))
    cb(new AppError('Não foi detectado um arquivo de imagem.', 400), 400);
  cb(null, true);
};

/*const upload = multer({ storage: multerStorage, fileFilter: multerFilter });*/
const upload = multer({ storage: multerStorage });

export default upload;
