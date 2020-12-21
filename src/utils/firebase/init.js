import firebase from 'firebase/app';
import config from './firebaseConfig';

import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

export default class FirebaseManager {
  constructor() {
    this._app = null;
    if (!FirebaseManager.instance) {
      this._app = firebase.initializeApp({
        ...config,
      });

      FirebaseManager.instance = this._app;
    }

    return FirebaseManager.instance;
  }
}
