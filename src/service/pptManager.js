import fs from 'fs';
import path from 'path';
import Converter from 'ppt-png';
import unoconv from 'unoconv';

const filePath = path.join(__dirname, '../assets/sample.pptx');
const outputPath = path.join(__dirname, '../output/');

console.log('hey', filePath);

export default {
  convert: () => {
    new Converter({
	    files: [filePath],
      output: outputPath,
      invert: outputPath,
	    logLevel: 2,
      deletePdfFile: true,
      documentConvert: 'libreoffice --headless --invisible --convert-to pdf *.pptx --outdir',
	    callback: function (data) {
        console.log(data.failed, data.success, data.files, data.time);
      },
    }).run();
  },
};
