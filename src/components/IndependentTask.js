import { useEffect, useState } from "react";
import instance from "./api_instance";
import { Text, Button, Box, Spinner, Heading, UnorderedList, ListItem } from "@chakra-ui/react";
import { useCallback } from "react";
import {useAudioRecorder} from 'react-audio-voice-recorder'
import { FaVolumeUp } from "react-icons/fa";
import Record from "./Record";
import axios from "axios";
import PrepareTimer from "./PrepareTimer";

function IndependentTask() {
    const [taskPrompt, setTaskPrompt] = useState('');
    const [isStarted, setIsStarted] = useState(false);
    const [isPrepare, setIsPrepare] = useState(false);
    const [isRecord, setIsRecord] = useState(false);
    const [utterance, setUtterance] = useState(null);
    const [transcript, setTranscript] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [result, setResult] = useState('');
    const {startRecording, stopRecording, recordingBlob} = useAudioRecorder();
    const [messages, setMessages] = useState([{role: 'system', 'content': "You'll be used as a TOEFL speaking test generator and grader"},
    {role: 'user', 'content': `Generate only a TOEFL Independent Speaking Task Prompt without time between the template ---PROMPT BEGIN---  ---PROMPT END---`}]);
    

    const fetchPrompt = useCallback(async () => {
        const response = await instance.post('/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: messages
        });
        setMessages([...messages, response.data.choices[0].message]);
        console.log(messages);
        let prompt = response.data.choices[0].message.content;
        console.log(prompt);
        let start = prompt.indexOf('---PROMPT BEGIN---') + '---PROMPT BEGIN---'.length;
        let end = prompt.indexOf('---PROMPT END---');
        prompt = prompt.substring(start, end);
        prompt = prompt.trim();
        const synth = window.speechSynthesis;
        synth.cancel();
        const u = new SpeechSynthesisUtterance(prompt);
        u.addEventListener('end', () => {
            setIsPrepare(true);
        });
        setUtterance(u);
        console.log(prompt);
        setTaskPrompt(prompt);
        return () => {
            synth.cancel();
        }
    }, []);

    const changeMessages = () => {
        const newObject = {role: 'user', 'content': `Judge this TOEFL speaking response accurately and give feedback in the template: ---BEGIN TEMPLATE--- Response length: Content: Delivery: Structure: Accuracy: ---END TEMPLATE--- ---RESPONSE START--- ${transcript} ---RESPONSE END--- based on ---TASK PROMPT START--- ${taskPrompt} ---TASK PROMPT END---`};
        const newMessages = [...messages, newObject];
        console.log(newObject.content);
        setMessages(newMessages);
    };

    const fetchResult = async () => {
        try {
            const response = await instance.post('/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: messages
            });
            let result = response.data.choices[0].message.content;
            let start = result.indexOf('---BEGIN TEMPLATE---') + '---BEGIN TEMPLATE---'.length;
            let end = result.indexOf('---END TEMPLATE---');
            console.log(result);
            setResult(result.substring(start, end));
            setMessages([...messages, response.data.choices[0].message]);
        } catch(error) {
            setResult('Error occurred in the OpenAI API');
        }
    };

    const fetchAnalysis = async () => {
        try {
            const formData = new FormData(); 
            formData.append('file', recordingBlob, 'file'); 
            const response = await axios.post('http://127.0.0.1:5000/analyse', 
            formData, {
                headers: {
                    'Content-Type': `multipart/form-data`
                }
            });
            setAnalysis(response.data);
            console.log(response);
        } catch(error) {
            setAnalysis('Error occurred in Speech Analysis');
        }
    }

    useEffect(() => {
        if (!recordingBlob) return;
        console.log(recordingBlob);

        // recordingBlob will be present at this point after 'stopRecording' has been called
      }, [recordingBlob])

    const handleClick = () => {
        setIsStarted(true);
        window.speechSynthesis.speak(utterance);
    }

    const handlePrepareEnd = () => {
        setIsPrepare(false);
        setIsRecord(true);
    }

    useEffect(() => {
        if (taskPrompt === '') {
            fetchPrompt();
        }
    }, []);

    useEffect(() => {
        if (transcript !== '') {
            console.log('Inside change messages');
            changeMessages();
        }
    }, [transcript]);

    useEffect(() => {
        if (transcript !== '' && result === '') {
            console.log('Inside fetch result');
            fetchResult();
        }
        if (transcript !== '' && analysis === '' && result === '') {
            fetchAnalysis();
        }
    }, [messages])

    return <Box minHeight='30vh' width='80vw'>
        {
            isStarted ? 
            (
            <>
            <Text minHeight='30vh' width='80vw' overflow='scroll'>{taskPrompt}</Text>
            <Box width='80vw' alignContent='center' justifySelf='center' alignSelf='center'>
                {isPrepare ? 
                <PrepareTimer prepareTime={20} handlePrepareEnd={handlePrepareEnd}/> :
                isRecord && <Record handleTranscript={setTranscript} timeoutTime={45} startRecording={startRecording} stopRecording={stopRecording}/>
                }
            </Box>
            </>
            ) :
            <Button onClick={handleClick} isLoading={taskPrompt === ''} 
            width='100px'
                loadingText='Loading'
                disabled={taskPrompt === ''} leftIcon={<FaVolumeUp />} colorScheme='teal'>
                Start
            </Button>
            
        }
        {transcript !== '' && result === '' && <Spinner colorScheme="teal"></Spinner>}
        {result !== '' && <Box>
            <Heading size='md'>Result</Heading>
            <Text minHeight='30vh' width='80vw' overflow='scroll'>{result}</Text>
            {analysis !== '' && <Heading size='md'>Analysis</Heading>}
            {analysis !== '' && <UnorderedList>{
                analysis.split('\n').length === 1 ? 
                <Text>{analysis}</Text>
                :
                analysis.split('\n').map((val, i) => i > 1 && val !== '' && <ListItem key={val}>{val}</ListItem>)
            }</UnorderedList>}
        </Box>
        }
        {/* {recordingBlob != null && recordingBlob != undefined && <audio src={URL.createObjectURL(recordingBlob)} controls></audio>} */}
    </Box> 
    
}

export default IndependentTask;