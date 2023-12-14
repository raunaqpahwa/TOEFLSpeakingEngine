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
import IndependentTask from './components/IndependentTask';

function App() {
  
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <Tabs colorScheme='teal' width='80vw' height='100vh' justifySelf='center' justifyContent='center'>
            <TabList>
              <Tab>Speaking Task</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack spacing={8}>
                  <IndependentTask />
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
