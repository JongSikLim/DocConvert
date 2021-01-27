import fs from 'fs-extra';
import path, { extname, basename } from 'path';
import { Readable } from 'stream';
import Converter from 'ppt-png';
import pdf2image from 'ppt-png/js/pdf2image';

import StorageManager from '../utils/ncp/storageManager';
import { BadRequest } from 'http-errors';

const storage = new StorageManager();
const outputPath = path.join(__dirname, '../output/');

let libreOfficeClientDir =
  process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '../../soffice.lnk')
    : 'libreoffice';

export default {
  /**
   * @title convert
   * @description 파일을 변환하여 네이버 클라우드 스토리지에 업로드 후 경로를 반환
   * @param file multer middleware 의해서 정의된 파일
   * @return Success => 변환 후 업로드 성공한 파일의 스토리지 경로 배열로 반환
   * @return Failure =>
   */
  convert: async (file) => {
    const { originalname, buffer, size } = file;
    let format = extname(originalname).toLocaleLowerCase();
    let tempFilePath;

    try {
      // SECTION 임시파일 생성
      tempFilePath = await createTempFile(originalname, buffer);
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
      case '.pptx':
      case '.docx':
        outputImageList = await convertOffice(tempFilePath, format);
        break;
      case '.pdf':
        outputImageList = await convertPdf(tempFilePath);
        break;
      case '.png':
      case '.jpg':
      case '.jpeg':
      case '.gif':
        outputImageList = [
          {
            page: 1,
            index: 1,
            name: tempFilePath,
          },
        ];
        break;
      default:
        throw new BadRequest('BAD_REQUEST');
    }

    let directory = storage.getDirectory(); // uuid v4 기법으로 난문자 생성
    let actions = outputImageList.map(async (file) => {
      return await storage.uploadByFilePath(directory, file.name);
    });

    return new Promise((resolve, reject) => {
      Promise.all(actions)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        })
        .finally(() => {
          let convertedFileDirectory = path.join(
            outputPath,
            basename(tempFilePath),
            '/'
          ); //변환한 png 파일 삭제
          deleteTempFile([convertedFileDirectory, tempFilePath]); // 변환을 위해 제작한 원본 스트림 파일 삭제
        });
    });
  },
};

// 변환을 위한 임시 파일 생성
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

// 파일 변환 및 업로드 이후 임시 파일 삭제
const deleteTempFile = (deletePathList = []) => {
  deletePathList.forEach((target) => {
    fs.removeSync(target);
    console.log('Deleted Temp File ', target);
  });
};

//SECTION MS OFFCIE TO PNG (xlsx, pptx, docx)
const convertOffice = (filePath, format) => {
  let command = `--headless --invisible --convert-to pdf *${format} --outdir`;
  let output = path.join(outputPath, basename(filePath), '/'); //  디렉토리: output/<filename>/

  console.log('output: ', output);

  return new Promise((resolve, reject) => {
    try {
      new Converter({
        files: [filePath],
        // output: `${outputPath}\\${basename(filePath)}\\`, //  디렉토리: output/<filename>/
        logLevel: 2,
        deletePdfFile: true,
        fileNameFormat: `page_%d`, // 디렉토리: output/<filename>/page_1
        documentConvert: `${libreOfficeClientDir} ${command}`,
        output,
        callback: function (data) {
          console.log('data.success[0]: ', data.success[0]);
          resolve(data.success[0]);
        },
      }).run();
    } catch (error) {
      reject(error);
    }
  });
};

//SECTION PDF TO PNG
const convertPdf = (filePath) => {
  return new Promise((resolve, reject) => {
    const converter = pdf2image.compileConverter({
      outputFormat: `${outputPath}page_%d`,
      outputType: 'png',
      stripProfile: true,
      density: '96',
      width: null,
      height: null,
    });

    converter
      .convertPDF(filePath)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
