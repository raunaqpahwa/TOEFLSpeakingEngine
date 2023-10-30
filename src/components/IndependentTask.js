import { useEffect, useState } from "react";
import instance from "./api_instance";
import { Text } from "@chakra-ui/react";
import { useCallback } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import { useRef } from "react";

function IndependentTask() {
    const [taskPrompt, setTaskPrompt] = useState('The prompt will appear here');
    const taskPromptRef= useRef(null);
    const {speak, voices} = useSpeechSynthesis();
    
    const initialMessages = [{role: 'system', 'content': "You'll be used as a TOEFL speaking test generator and grader"},
                            {role: 'user', 'content': `Generate only a TOEFL Independent 
                                            Speaking Task Prompt without time in the format Prompt:`}];

    const fetchPrompt = useCallback(async () => {
        const response = await instance.post('/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: initialMessages
        });
        let prompt = response.data.choices[0].message.content.replace('Prompt:', '');
        prompt = prompt.trim();
        console.log(prompt);
        setTaskPrompt(prompt);
        taskPromptRef.current.click();
    }, []);

    useEffect(() => {
        fetchPrompt();
    }, [fetchPrompt]);

    return <>
        <Text minHeight='30vh' width='80vw' overflow='scroll' ref={taskPromptRef} 
        onClick={() => {
            speak({text: taskPrompt, voice: voices[158]});
            console.log('Button clicked!');
        }}>{taskPrompt}</Text>
    </>
}

export default IndependentTask;