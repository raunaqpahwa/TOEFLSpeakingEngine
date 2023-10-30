import React from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Grid,
  theme,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import Record from './components/Record';
import IndependentTask from './components/IndependentTask';

function App() {
  
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <Tabs>
            <TabList>
              <Tab>Introduction</Tab>
              <Tab>Task 1</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <p>Introduction</p>
              </TabPanel>
              <TabPanel>
                <VStack spacing={8}>
                  <IndependentTask />
                  <Record />
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
