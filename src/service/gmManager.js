import fs from 'fs';
import gmC from 'gm';
import path from 'path';

const gm = gmC.subClass({ imageMagick: true });

const filePath = path.join(__dirname, '../assets/sample.pdf');
const outputPath = path.join(__dirname, '../output/test.png');

const pptFilePath = path.join(__dirname, '../assets/sample.pptx');
const pptOutputPath = path.join(__dirname, '../output/test2.png');

// 이미지 변환
export function convert() {
  gm(filePath).write(outputPath, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log('Convert Success');
  });
}

export function convertPpt() {
  gm(pptFilePath).write(pptOutputPath, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log('Convert Success');
  });
}
