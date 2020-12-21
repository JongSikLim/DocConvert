import { Storage } from '@google-cloud/storage';
import serviceKey from './serviceAccountKey.json';

const storage = new Storage({
  keyFilename: serviceKey,
});

let bucketName = 'shipsideapp-imjs.appspot.com';
let fileName = 'test.pdf';

export default class StorageManager {
  constructor() {
    if (!StorageManager.instance) {
      StorageManager.instance = this;
    }

    return StorageManager.instance;
  }

  uploadFile = async () => {
    await storage.bucket(bucketName).upload(filename, {
      gzip: true,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });
  };
}
