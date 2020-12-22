import { convert } from 'imagemagick';
import path, { basename } from 'path';
import Converter from 'ppt-png';
import pdf2image from 'ppt-png/js/pdf2image';

// const filePath = path.join(__dirname, '../assets/sample.pptx');
const outputPath = path.join(__dirname, '../output/');
const libreOfficeClientDir = path.join(__dirname, '../../soffice.lnk');
const pptOptionParameter =
  '--headless --invisible --convert-to pdf *.pptx --outdir';

const docxOptionParameter =
  '--headless --invisible --convert-to pdf *.docx --outdir';

const xlsxOptionParameter =
  '--headless --invisible --convert-to pdf *.xlsx --outdir';

export default {
  //SECTION PPT TO PNG
  convertPpt: (filePath) => {
    return new Promise((resolve, reject) => {
      try {
        new Converter({
          files: [filePath],
          output: `${outputPath}\\${basename(filePath)}\\`, //  디렉토리: output/<filename>/
          logLevel: 2,
          deletePdfFile: true,
          fileNameFormat: `page_%d`, // 디렉토리: output/<filename>/page_1
          documentConvert: `${libreOfficeClientDir} ${pptOptionParameter}`,
          callback: function (data) {
            resolve(data.success[0]);
          },
        }).run();
      } catch (error) {
        reject(error);
      }
    });
  },
  //SECTION DOCX TO PNG
  convertDocx: (filePath) => {
    return new Promise((resolve, reject) => {
      try {
        new Converter({
          files: [filePath],
          output: `${outputPath}\\${basename(filePath)}\\`, //  디렉토리: output/<filename>/
          logLevel: 2,
          deletePdfFile: true,
          fileNameFormat: `page_%d`, // 디렉토리: output/<filename>/page_1
          documentConvert: `${libreOfficeClientDir} ${docxOptionParameter}`,
          callback: function (data) {
            resolve(data.success[0]);
          },
        }).run();
      } catch (error) {
        reject(error);
      }
    });
  },
  //SECTION XLSX TO PNG
  convertExcel: (filePath) => {
    return new Promise((resolve, reject) => {
      try {
        new Converter({
          files: [filePath],
          output: `${outputPath}\\${basename(filePath)}\\`, //  디렉토리: output/<filename>/
          logLevel: 2,
          deletePdfFile: true,
          fileNameFormat: `page_%d`, // 디렉토리: output/<filename>/page_1
          documentConvert: `${libreOfficeClientDir} ${xlsxOptionParameter}`,
          callback: function (data) {
            resolve(data.success[0]);
          },
        }).run();
      } catch (error) {
        reject(error);
      }
    });
  },
  //SECTION PDF TO PNG
  convertPdf: (filePath) => {
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
  },
};
