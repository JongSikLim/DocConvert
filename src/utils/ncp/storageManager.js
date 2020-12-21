import * as AWS from 'aws-sdk';
import fs from 'fs';

const endpoint = new AWS.Endpoint('https://kr.object.ncloudstorage.com');
const region = 'kr-standard';
const access_key = 'HtneH6MDWmURbCW57ij4';
const secret_key = '09znmch5ENIzl5jROGUm4oFzoCqDKDLUhsKhj3ad';

const S3 = new AWS.S3({
  endpoint,
  region,
  credentials: {
    accessKeyId: access_key,
    secretAccessKey: secret_key,
  },
});

const bucket_name = 'codebrewing';
const MAX_KEYS = 300;

const params = {
  Bucket: bucket_name,
  MaxKeys: MAX_KEYS,
};

export default class StorageManager {
  // SECTION UPLOAD
  async upload(directory, fileName, buffer, size, successHandler) {
    let object_name = directory;
    // create folder
    await S3.putObject({
      Bucket: bucket_name,
      Key: directory,
    }).promise();

    object_name = fileName;
    // upload file
    await S3.putObject({
      Bucket: bucket_name,
      Key: `${directory}${fileName}`,
      ACL: 'public-read',
      // ACL을 지우면 전체공개가 되지 않습니다.
      // Body: fs.createReadStream(local_file_path), //FIXME 메모리 스트림 테스트
      Body: buffer,
      ContentLength: size,
    })
      .promise()
      .then((res) => {
        console.log('res: ', res);
        successHandler();
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
}
