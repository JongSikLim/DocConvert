import fs from 'fs';
import path from 'path';
import Converter from 'ppt-png';

const filePath = path.join(__dirname, '../assets/sample.ppt');

export default {
  convert: () => {
    new Converter({
      files: [...filePathq],
      output: 'output/',
      logLevel: 2,
      callback: function (data) {
        console.log(data.failed, data.success, data.files, data.time);
      },
    }).run();
  },
};
