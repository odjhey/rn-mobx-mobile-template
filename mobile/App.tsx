/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {Store, init} from '@product1/core';
// TODO: we may be able to move this to our modules, keep for now
import {observer} from 'mobx-react-lite';
import {storage} from './app/libs/localstorage';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const NoteEditor = ({
  id,
  value,
  updateFn,
}: {
  id: string;
  value: string;
  updateFn: (id: string, value: string) => unknown;
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState(id);
  const [newValue, setNewValue] = useState(value);

  const handleUpdate = () => {
    updateFn(selectedNoteId, newValue);
    setNewValue(''); // Clear input after update
  };

  return (
    <View>
      <Text>Select Note ID:</Text>
      <TextInput
        value={selectedNoteId}
        onChangeText={setSelectedNoteId}
        placeholder="Enter note ID"
      />
      <Text>Edit Note Value:</Text>
      <TextInput
        value={newValue}
        onChangeText={setNewValue}
        placeholder="Enter new value"
      />
      <Button title="Update Note" onPress={handleUpdate} />
    </View>
  );
};

const StateComponent = observer(({store}: {store: Store}) => {
  return (
    <View>
      <Text>{store.ui.notes().length}</Text>
      <Button
        title="test"
        onPress={() => {
          store.ui.createNote(Date.now().toString());
        }}
      />
      <Button
        title="clear"
        onPress={() => {
          store.ui.clearNotes();
        }}
      />
      <NoteEditor
        id={''}
        value={''}
        updateFn={(id, value) => {
          store.ui.editNote({id}, {value});
        }}
      />
      <Text>{JSON.stringify(store.ui.notes(), null, 2)}</Text>
    </View>
  );
});

const App = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const tmpStore = init({
    storage,
  });

  const [store, setStore] = useState<Awaited<typeof tmpStore>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tmpStore
      .then(s => {
        setStore(s);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="LSl">
            {!loading && store && <StateComponent store={store} />}
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
