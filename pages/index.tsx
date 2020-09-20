// import Head from 'next/head'
import { FormEvent, useState } from 'react';
import { Flex, Image, Button, Text } from '@chakra-ui/core'
import Input from '../components/Input';
import axios from 'axios';

export default function Home() {
  const [email, setEmail ] = useState('');
  const [message, setMessage] = useState(false);

  async function handleSignUpToNewsletter(event: FormEvent) {
    event.preventDefault();

    const { data } = await axios.post('/api/subscribe', { email: email });

    if(data.ok){
      setMessage(true);
    }
  }

  return (
    <Flex
      as="main"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Flex
        as="form"
        onSubmit={handleSignUpToNewsletter}
        backgroundColor="gray.700"
        borderRadius="md"
        flexDir="column"
        alignItems="stretch"
        padding={8}
        marginTop={4}
        width="100%" 
        maxW="400px"
      >
        <Image marginBottom={8} width={120} marginLeft={120} src="/gotec_logo.png" alt="Gotec Academy" />
  
        <Text textAlign="center" fontSize="sm" color="gray.400" marginBottom={2}>
          Assine a newsletter da Gotec Academy e receba os melhores conteúdos sobre programação!
        </Text>
  
        {!message && <Input
          placeholder="Seu melhor e-mail"
          marginTop={2}
          value={email}
          onChange={e => setEmail(e.target.value)}
        /> }
  
        {message && <h1>Cadastro realizado com sucesso!</h1>}

        <Button
          type="submit"
          backgroundColor="blue.500"
          height="50px"
          borderRadius="sm"
          marginTop={6}
          _hover={{ backgroundColor: 'purple.600' }}
        >
          INSCREVER
        </Button>
      </Flex>
    </Flex>
  )
}
