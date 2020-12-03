import Manager from 'ppt-png';
import fs from 'fs';
import path from 'path';
const sample = fs.readFileSync(path.join(__dirname, '../assets/sample.pptx'));

export default {
  convert: (file, next) => {
    console.log('call Convert');
    new Manager({
      files: [...sample],
      output: 'output/',
      invert: true,
      outputType: 'png',
      logLevel: 2,
      callback: function (data) {
        console.log('response');
        console.log('data:', data);
        next();
      },
    }).run();
  },
};
