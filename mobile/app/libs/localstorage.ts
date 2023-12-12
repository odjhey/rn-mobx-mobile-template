import AsyncStorage from '@react-native-async-storage/async-storage';

const ROOTSTORE_KEY = 'rootstore-mobilestuff-v0';

const storage = {
  getItem: () => {
    // TODO: handle error
    return AsyncStorage.getItem(ROOTSTORE_KEY).then(v => JSON.parse(v || '{}'));
  },
  setItem: (v: object) => {
    return AsyncStorage.setItem(ROOTSTORE_KEY, JSON.stringify(v));
  },
};

export {storage};
