import { Button, Stack, Select, Textarea, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaMicrophoneAlt, FaMicrophoneAltSlash } from "react-icons/fa";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function Record() {
    const [language, setLanguage] = useState('en-US');
    const [timeoutPeriod, setTimeoutPeriod] = useState(30);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable
      } = useSpeechRecognition();

    useEffect(() => {
        let intervalId = listening && setInterval(() => {
            let newTimeout = timeoutPeriod - 1;
            setTimeoutPeriod(newTimeout);
        }, 1000);
        if (!listening || timeoutPeriod === 0) {
            clearInterval(intervalId);
        }
        return () => clearTimeout(intervalId);
    }, [listening, timeoutPeriod]);

    useEffect(() => {
        const timeoutId = listening && setTimeout(() => SpeechRecognition.stopListening(), (timeoutPeriod + 1) * 1000);
        return () => clearTimeout(timeoutId);
    }, [listening]);


    const handleLanguageChange = (event) => {
        setLanguage(event.target.selectedOptions[0].value);
    }

    const handleStartListening = () => {
        resetTranscript();
        setTimeoutPeriod(30);
        SpeechRecognition.startListening({continuous: true, language});
    }

    const handleReset = () => {
        setTimeoutPeriod(30);
        resetTranscript();
    }

    return <> 
        <Textarea 
        resize='none'
        colorScheme='teal'
        border='2px solid teal'
        minHeight='20vh' width='80vw' overflow='scroll'
        placeholder='Transcription' readOnly textAlign='left'size='md' value={transcript}/>
        <Stack direction='row' spacing={4} align='center'>
            <Button isLoading={listening} 
            loadingText='Recording'
            colorScheme='teal' leftIcon={<FaMicrophoneAlt />} 
            variant='solid' 
            onClick={handleStartListening}
            spinnerPlacement="start">Start</Button>
            <Button 
            onClick={SpeechRecognition.stopListening} colorScheme='teal' 
            leftIcon={<FaMicrophoneAltSlash />} 
            variant='outline'>Stop</Button>
            <Button onClick={handleReset} variant='outline' colorScheme='teal' isDisabled={listening}>Reset</Button>
        </Stack>
        <Select placeholder="Select language" width='30vw' defaultValue={'en-US'} defaultChecked onChange={handleLanguageChange}>
            <option value='en-AU'>English (Australia)</option>
            <option value='en-IN'>English (India)</option>
            <option value='en-NZ'>English (New Zealand)</option>
            <option value='en-ZA'>English (South Africa)</option>
            <option value='en-GB'>English (United Kingdom)</option>
            <option value='en-US'>English (United States)</option> 
        </Select>
        <Text>You have {timeoutPeriod} seconds remaining</Text>
    </>
}

export default Record;