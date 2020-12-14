import fs from 'fs';
import path from 'path';
import Converter from 'ppt-png';
import unoconv from 'unoconv';

const filePath = path.join(__dirname, '../assets/sample.ppt');
const outputPath = path.join(__dirname, '../output/');

export default {
  convert: () => {
    new Converter({
      files: [...filePath],
      output: outputPath,
      logLevel: 2,
      deletePdfFile: true,
      callback: function (data) {
        console.log(data.failed, data.success, data.files, data.time);
      },
    }).run();
  },
  unoconvConvert: ()=>{
	  unoconv.convert(
		  filePath, 
		  'pdf', 
		  (err, result)=>{
			  fs.writeFile('test.pdf',result);
		  }
	  );
  }
};
