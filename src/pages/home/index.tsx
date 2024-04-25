import 'reactflow/dist/style.css';
import {v4 as uuidv4} from 'uuid';
import {Input} from '@chakra-ui/react'

import {Button, ButtonGroup, Container, Flex, SimpleGrid, Text} from "@chakra-ui/react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar/SideBar";
import {useEffect, useState} from 'react';
import axios from "axios";

interface Notifier {
    message: string;
}


function Index() {

    const generateUUID = () => uuidv4();

    const [uuid, setUuid] = useState<string>(generateUUID());
    const [type, setType] = useState('VIEWER');
    const [messages, setMessages] = useState<Notifier[]>([]);

    const [sse, setSse] = useState<EventSource | undefined>(undefined);

    const handleRegister = async () => {
        if (sse) {
            sse.close(); // Fechar a conexão anterior, se houver
        }

        const newSse = new EventSource(`http://localhost:8081/emmiter/subscribe/test/${uuid}/${type}`);
        setSse(newSse);

        newSse.onmessage = (e: MessageEvent) => {
            const data: Notifier = JSON.parse(e.data);
            getRealtimeData(data);
        };

        newSse.onerror = () => {
            newSse.close();
            setSse(undefined);
        };
    };

    function getRealtimeData(data: Notifier) {
        setMessages(oldValue => [...oldValue, data]);
    }

    return (
        <Flex direction="column" height="100vh">
            <Header/>

            <Flex width="100%" my="6" maxWidth={1480} mx="auto" px="6">
                <SimpleGrid flex="1" gap="4" minChildWidth="320px" alignItems="center">
                    <Container
                        padding={["6", "8"]}
                        paddingBottom="4"
                        backgroundColor="gray.800"
                        borderRadius={8}
                    >
                        <label>
                            {uuid}
                        </label>

                        <div style={{maxHeight: '200px', overflowY: 'auto'}}>
                            <ul>
                                {messages.map((message, index) => (
                                    <li key={index}>{message.message}</li>
                                ))}
                            </ul>
                        </div>


                        <Container
                            mt={10}
                            display={'flex'}
                            flexDirection={'row'}
                        >

                            <Input
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                placeholder='VIEWER | AGENT'/>


                            <Button
                                onClick={handleRegister}
                                colorScheme='blue'>Register
                            </Button>

                        </Container>

                    </Container>
                </SimpleGrid>
            </Flex>
        </Flex>
    )
}

export default Index
