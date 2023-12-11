import {createMiddleware} from '@product1/core/dist/models/setup';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ROOTSTORE_KEY = 'rootstore-mobilestuff-v0';
export const loadFromStorage = createMiddleware(
  ({applySnapshot}) =>
    async store => {
      await AsyncStorage.getItem(ROOTSTORE_KEY).then(snap => {
        // TODO: handle error
        if (snap) {
          const snapObj = JSON.parse(snap);
          applySnapshot(store, snapObj);
        }
      });

      return store;
    },
);

export const saveOnChange = createMiddleware(({onSnapshot}) => async store => {
  onSnapshot(store, snap => {
    AsyncStorage.setItem(ROOTSTORE_KEY, JSON.stringify(snap));
  });

  return store;
});
