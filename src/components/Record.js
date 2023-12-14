import { Button, Stack, Select, Textarea, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { FaMicrophoneAlt, FaMicrophoneAltSlash } from "react-icons/fa";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function Record({timeoutTime, startRecording, stopRecording, prompt, handleTranscript}) {
    const [language, setLanguage] = useState('en-US');
    const [timeoutPeriod, setTimeoutPeriod] = useState(timeoutTime);
    const [isRecording, setIsRecording] = useState(false);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable
      } = useSpeechRecognition();

    useEffect(() => {
        let intervalId = setInterval(() => {
            let newTimeout = timeoutPeriod - 1;
            setTimeoutPeriod(newTimeout);
        }, 1000);
        if (timeoutPeriod === 0) {
            setIsRecording(false);
            stopRecording();
            clearInterval(intervalId);
            handleTranscript(transcript);
            SpeechRecognition.stopListening();
        }
        return () => clearTimeout(intervalId);
    }, [timeoutPeriod]);

    useEffect(() => {
        // console.log('Inside setting timeout');
        if (!isRecording) {
            SpeechRecognition.startListening({continuous: true, language});
            startRecording();
            // console.log('Started listening');
            setIsRecording(true);
        }
    
        setTimeout(() => {
            if (isRecording) {
                SpeechRecognition.stopListening();
                stopRecording();
                // console.log('Stopped recording');
                setIsRecording(false);
                console.log(transcript);
            }
        }, (timeoutPeriod + 1) * 1000);
    }, []);

    const handleLanguageChange = (event) => {
        setLanguage(event.target.selectedOptions[0].value);
    }

    return <VStack justifyContent='center' alignContent='center' width='80vw'> 
        {/* <Textarea 
        resize='none'
        colorScheme='teal'
        alignSelf='center'
        border='2px solid teal'
        minHeight='20vh' width='80vw' overflow='scroll'
        placeholder='Transcription' readOnly textAlign='left' size='md' value={transcript}/>  */}
        <Stack direction='row' spacing={4} align='center' alignContent='center' justifyContent='center' margin='10px'>
        {isRecording ? 
            <>
            <Button isLoading={listening} 
            loadingText='Recording'
            colorScheme='teal' leftIcon={<FaMicrophoneAlt />} 
            variant='solid' 
            isDisabled={true}
            spinnerPlacement="start">Start</Button>
            {/* <Button 
            onClick={() => {
                stopRecording();
                SpeechRecognition.stopListening();
                setIsRecording(false);
            }} colorScheme='teal' 
            leftIcon={<FaMicrophoneAltSlash />} 
            variant='outline'>Stop</Button> */}
            </>
            :
            <Text as='b' color='teal' fontSize='xl'>Response Recorded</Text>
        }
        </Stack>
        

        <Select marginBottom='10px' justifySelf='center' alignSelf='center' placeholder="Select language" width='30vw' defaultValue={'en-US'} defaultChecked onChange={handleLanguageChange}>
            <option value='en-AU'>English (Australia)</option>
            <option value='en-IN'>English (India)</option>
            <option value='en-NZ'>English (New Zealand)</option>
            <option value='en-ZA'>English (South Africa)</option>
            <option value='en-GB'>English (United Kingdom)</option>
            <option value='en-US'>English (United States)</option> 
        </Select>
        {isRecording && 
        <Text as='b' color='teal' fontSize='xl'>You have {timeoutPeriod} {timeoutPeriod === 1 ? 'second' : 'seconds'} remaining to record you response</Text>
        }
    </VStack>
}

export default Record;