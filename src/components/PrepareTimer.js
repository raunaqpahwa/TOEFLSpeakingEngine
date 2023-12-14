import { useEffect, useState } from "react";
import { Text } from '@chakra-ui/react';

function PrepareTimer({prepareTime, handlePrepareEnd}) {
    const [preparePeriod, setPreparePeriod] = useState(prepareTime);

    useEffect(() => {
        let intervalId = setInterval(() => {
            let newTimeout = preparePeriod - 1;
            setPreparePeriod(newTimeout);
        }, 1000);
        if (preparePeriod === 0) {
            handlePrepareEnd();
            clearInterval(intervalId);
        }
        return () => clearInterval(intervalId);
    });

    useEffect(() => {
        let timeoutId = setTimeout(() => handlePrepareEnd(), (prepareTime + 1) * 1000);
        return () => clearTimeout(timeoutId);
    });
    return <>
        <Text as='b' color='teal' fontSize='xl'>You have {preparePeriod} {preparePeriod === 1 ? 'second' : 'seconds'} remaining to prepare</Text>
    </>
}

export default PrepareTimer;