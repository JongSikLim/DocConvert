import { fromPath } from 'pdf2pic';
import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '../assets/sample.pptx');
const sample = fs.readFileSync(filePath);

const options = {
  density: 100,
  saveFilename: 'untitled',
  savePath: './images',
  format: 'png',
  width: 600,
  height: 600,
};

const storeAsImage = fromPath('/path/to/pdf/sample.pdf', options);
const pageToConvertAsImage = 1;

export default {
  convert: (file, next) => {
    storeAsImage(pageToConvertAsImage).then((resolve) => {
      console.log('Page 1 is now converted as image');

      return resolve;
    });
  },
};
