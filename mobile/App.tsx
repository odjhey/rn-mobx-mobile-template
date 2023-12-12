/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
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

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {createStore, setup} from '@product1/core';
// TODO: we may be able to move this to our modules, keep for now
import {observer} from 'mobx-react-lite';
import {loadFromStorage, saveOnChange} from './app/libs/localstorage';

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

const NoteEditor = ({id, value, updateFn}) => {
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

const StateComponent = observer(({store}) => {
  return (
    <View>
      <Text>{store.userspace.ui.activeNote?.value}-</Text>
      <Text>{store.userspace.ui.stateRef.notes.length}</Text>
      <Button
        title="test"
        onPress={() => {
          store.userspace.ui.addNote(Date.now().toString());
        }}
      />
      <Button
        title="clear"
        onPress={() => {
          store.userspace.ui.clear();
        }}
      />
      <NoteEditor
        id={store.userspace.ui.activeNote?.id}
        value={store.userspace.ui.activeNote?.value}
        updateFn={(id, value) => {
          store.userspace.ui.updateNote({id}, {value});
        }}
      />
      <Text>{JSON.stringify(store.userspace.ui.notes(), null, 2)}</Text>
    </View>
  );
});

const App = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const store = createStore();
  setup(store, [saveOnChange, loadFromStorage]);

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
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="LSl">
            <StateComponent store={store} />
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
