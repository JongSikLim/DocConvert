import path, { basename } from 'path';
import Converter from 'ppt-png';

const filePath = path.join(__dirname, '../assets/sample.pptx');
const outputPath = path.join(__dirname, '../output/');
const libreOfficeClientDir = path.join(__dirname, '../../soffice.lnk');
const pptOptionParameter =
  '--headless --invisible --convert-to pdf *.pptx --outdir';

const docxOptionParameter =
  '--headless --invisible --convert-to pdf *.docx --outdir';

const xlsxOptionParameter =
  '--headless --invisible --convert-to pdf *.xlsx --outdir';

export default {
  convertPpt: () => {
    new Converter({
      files: [filePath],
      output: `${outputPath}\\${basename(filePath)}\\`, //  디렉토리: output/<filename>/
      logLevel: 2,
      deletePdfFile: true,
      fileNameFormat: `page_%d`, // 디렉토리: output/<filename>/page_1
      documentConvert: `${libreOfficeClientDir} ${pptOptionParameter}`,
      callback: function (data) {
        console.log(data.failed, data.success, data.files, data.time);
      },
    }).run();
  },
  convertDocx: () => {
    new Converter({
      files: [filePath],
      output: `${outputPath}\\${basename(filePath)}\\`, //  디렉토리: output/<filename>/
      logLevel: 2,
      deletePdfFile: true,
      fileNameFormat: `page_%d`, // 디렉토리: output/<filename>/page_1
      documentConvert: `${libreOfficeClientDir} ${docxOptionParameter}`,
      callback: function (data) {
        console.log(data.failed, data.success, data.files, data.time);
      },
    }).run();
  },
  convertExcel: () => {
    new Converter({
      files: [filePath],
      output: `${outputPath}\\${basename(filePath)}\\`, //  디렉토리: output/<filename>/
      logLevel: 2,
      deletePdfFile: true,
      fileNameFormat: `page_%d`, // 디렉토리: output/<filename>/page_1
      documentConvert: `${libreOfficeClientDir} ${xlsxOptionParameter}`,
      callback: function (data) {
        console.log(data.failed, data.success, data.files, data.time);
      },
    }).run();
  },
};
