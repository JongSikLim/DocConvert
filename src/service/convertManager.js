import StorageManager from '../utils/ncp/storageManager';
import path, { extname } from 'path';
import pptManager from './pptManager';
import fs, { read } from 'fs';
import { Readable } from 'stream';
const storage = new StorageManager();

export default {
  convert: async (file) => {
    const { originalname, buffer, size } = file;
    let format = extname(originalname);
    let convertedFileList = [];
    let tempFilePath;

    try {
      tempFilePath = await createTempFile(originalname, buffer); // SECTION 임시파일 생성
    } catch (error) {
      throw error;
    }

    switch (format) {
      case '.xlsx':
        pptManager.convertExcel(tempFilePath);
        break;
      case '.pptx':
        pptManager.convertPpt(tempFilePath);
        break;
      case '.docx':
        pptManager.convertDocx(tempFilePath);
        break;
      case '.pdf':
        break;
    }

    convertedFileList.forEach((file) => {
      storage.upload();
    });
  },
};

async function createTempFile(filename, data) {
  return new Promise((resolve, reject) => {
    let sampleFilePath = path.join(__dirname, `../temp/${filename}`);
    let readStream = Readable.from(data);
    let writeStream = fs.createWriteStream(sampleFilePath);

    readStream.pipe(writeStream);

    readStream.on('end', () => {
      resolve(sampleFilePath);
    });

    readStream.on('error', (err) => {
      reject(err);
    });
  });
}
async function checkType() {}
