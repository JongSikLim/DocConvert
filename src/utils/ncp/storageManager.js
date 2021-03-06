import * as AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import Config from '../../../env/cloud.config';

const { ACCESS_KEY, AWS_END_POINT, SECRET_KEY, REGION, BUCKET_NAME } = Config;

const endpoint = new AWS.Endpoint(AWS_END_POINT);
const region = REGION;
const access_key = ACCESS_KEY;
const secret_key = SECRET_KEY;
const bucket_name = BUCKET_NAME;

const S3 = new AWS.S3({
  endpoint,
  region,
  credentials: {
    accessKeyId: access_key,
    secretAccessKey: secret_key,
  },
});

const MAX_KEYS = 300;

const params = {
  Bucket: bucket_name,
  MaxKeys: MAX_KEYS,
};

export default class StorageManager {
  // SECTION UPLOAD
  /**
   * @title uploadByFilePath
   * @description 로컬의 파일 경로를 기반으로 파일을 읽어 S3에 저장
   * @param directory 저장할 스토리지의 내부 경로
   * @param filePath 현재 로컬에 저장된 파일의 위치
   * @return Success => 파일 경로 반환
   * @return Failure =>
   */
  async uploadByFilePath(directory, filePath) {
    let stream = readFile(filePath);
    let fileName = path.basename(filePath);

    // 폴더 생성
    await S3.putObject({
      Bucket: bucket_name,
      Key: directory,
    }).promise();

    // 파일 생성
    await S3.putObject({
      Bucket: bucket_name,
      Key: `${directory}${fileName}`,
      ACL: 'public-read',
      Body: stream,
      // ContentLength: size,
    }).promise();

    return `${directory}${fileName}`;
  }
  async upload(directory, fileName, buffer, size) {
    // create folder
    await S3.putObject({
      Bucket: bucket_name,
      Key: directory,
    }).promise();

    // upload file
    await S3.putObject({
      Bucket: bucket_name,
      Key: `${directory}${fileName}`,
      ACL: 'public-read',
      Body: buffer,
      ContentLength: size,
    })
      .promise()
      .then((res) => {
        console.log('res: ', res);
      })
      .catch((err) => {
        console.log('err: ', err);
      });
  }

  //SECTION GET LIST
  async getList() {
    // List All Objects
    console.log('List All In The Bucket');
    console.log('==========================');

    while (true) {
      let response = await S3.listObjectsV2(params).promise();

      console.log(`IsTruncated = ${response.IsTruncated}`);
      console.log(`Marker = ${response.Marker ? response.Marker : null}`);
      console.log(
        `NextMarker = ${response.NextMarker ? response.NextMarker : null}`
      );
      console.log(`  Object Lists`);
      for (let content of response.Contents) {
        console.log(
          `    Name = ${content.Key}, Size = ${content.Size}, Owner = ${content.Owner.ID}`
        );
      }

      if (response.IsTruncated) {
        params.Marker = response.NextMarker;
      } else {
        break;
      }
    }

    // List Top Level Folder And Files
    params.Delimiter = '/';
    console.log('Top Level Folders And Files In The Bucket');
    console.log('==========================');

    while (true) {
      let response = await S3.listObjectsV2(params).promise();

      console.log(`IsTruncated = ${response.IsTruncated}`);
      console.log(`Marker = ${response.Marker ? response.Marker : null}`);
      console.log(
        `NextMarker = ${response.NextMarker ? response.NextMarker : null}`
      );

      console.log(`  Folder Lists`);
      for (let folder of response.CommonPrefixes) {
        console.log(`    Name = ${folder.Prefix}`);
      }

      console.log(`  File Lists`);
      for (let content of response.Contents) {
        console.log(
          `    Name = ${content.Key}, Size = ${content.Size}, Owner = ${content.Owner.ID}`
        );
      }

      if (response.IsTruncated) {
        params.Marker = response.NextMarker;
      } else {
        break;
      }
    }
  }

  //SECTION DOWNLOAD
  async download() {
    let outStream = fs.createWriteStream(local_file_path);
    let inStream = S3.getObject({
      Bucket: bucket_name,
      Key: object_name,
    }).createReadStream();

    inStream.pipe(outStream);
    inStream.on('end', () => {
      console.log('Download Done');
    });
  }

  //SECTION DELETE
  async delete() {
    // Delete Folder
    let object_name = 'sample-folder/';

    await S3.deleteObject({
      Bucket: bucket_name,
      Key: object_name,
    }).promise();

    // Delete File
    object_name = 'sample-object';

    await S3.deleteObject({
      Bucket: bucket_name,
      Key: object_name,
    }).promise();
  }

  getDirectory() {
    return `${v4()}/`;
  }
}

// 인자로 받은 경로의 파일 데이터를 읽어 스트림으로 반환
const readFile = (path) => {
  return fs.createReadStream(path);
};
