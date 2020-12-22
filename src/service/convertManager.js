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
    let tempFilePath;

    try {
      tempFilePath = await createTempFile(originalname, buffer); // SECTION 임시파일 생성
    } catch (error) {
      throw error;
    }

    /**
     * [{
     *  page : 페이지 값 (일반적인 상황에서 인덱스와 동치)
     *  index : 순수한 인덱스
     *  name : 파일위치
     * },,,]
     */
    let outputImageList = [];

    switch (format) {
      case '.xlsx':
        outputImageList = await pptManager.convertExcel(tempFilePath);
        break;
      case '.pptx':
        outputImageList = await pptManager.convertPpt(tempFilePath);
        break;
      case '.docx':
        outputImageList = await pptManager.convertDocx(tempFilePath);
        break;
      case '.pdf':
        outputImageList = await pptManager.convertPdf(tempFilePath);
        break;
    }

    let directory = storage.getDirectory();

    let actions = outputImageList.map(async (file) => {
      return await storage.uploadByFilePath(directory, file.name);
    });

    return new Promise((resolve, reject) => {
      Promise.all(actions).then((res) => {
        resolve(res);
      });
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
