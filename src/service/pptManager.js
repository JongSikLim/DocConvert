import document from 'file-convert';
import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '../assets/sample.pptx');
const sample = fs.readFileSync(filePath);

const options = {
  libreofficeBin: '/usr/bin/soffice',
  sourceFile: filePath, // .ppt, .pptx, .odp, .key and .pdf
  outputDir: '../output',
  img: true,
  imgExt: 'png', // Optional and default value png
  reSize: 800, //  Optional and default Resize is 1200
  density: 120, //  Optional and default density value is 120
};

export default {
  convert: (file, next) => {
    document
      .convert(options)
      .then((res) => {
        console.log('res: ', res);
        next();
      })
      .catch((err) => {
        console.log('err: ', err);
      });
  },
};
