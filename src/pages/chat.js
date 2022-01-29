import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useEffect, useState } from 'react';
import appConfig from '../styles/appConfig.json';

export default function ChatPage() {
  const [message, setMessage] = useState('')
  const [messageList, setMessageList] = useState([])

  useEffect(() => {
    supabase
      .from('messages')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        setMessageList(data)
      })
  }, [])

  function handleNewMessage(newMessage) {
    const message = {
      // id: messageList.length,
      from: 'alex-dll',
      text: newMessage,
    }

    supabase
      .from('messages')
      .insert([
        message
      ])
      .then(({ data }) => {
        setMessageList([
          data[0],
          ...messageList
        ])
      })
    // if (data.message.text !== '') {
    //   setMessageList([
    //     message,
    //     ...messageList
    //   ])
    // }
  }

  function handleDeleteMessage(messageToRemove) {
    const messageId = messageToRemove.id
    const messageListFiltered = messageList.filter((messageFiltered) => {
      return messageFiltered.id != messageId
    })

    setMessageList(messageListFiltered);
  }


  return (
    <Box
      styleSheet={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: 'url(https://images.unsplash.com/photo-1613376023733-0a73315d9b06?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80)' || 'url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)',
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.primary[900],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.primary[800],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >

          <MessageList messageList={messageList} handleDeleteMessage={handleDeleteMessage} />

          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5px',
            }}
          >
            <TextField
              value={message}
              onChange={({ target }) => {
                setMessage(target.value)
              }}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()

                  handleNewMessage(message)
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.primary[400],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[999],
              }}
            />
            <Button iconName="FaArrowRight"
              onClick={(event) => {
                event.preventDefault();
                handleNewMessage(message);
              }}
              styleSheet={{
                height: '5px',
                marginBottom: '9px',
              }}
              type='submit'
              size="sm"
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary'
          colorVariant='neutral'
          label='Logout'
          href="/"
        />
      </Box>
    </>
  )
}

function MessageList(props) {
  const handleDeleteMessage = props.handleDeleteMessage

  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
      }}
    >
      {props.messageList.map((message) => {
        return (
          <Text
            key={message.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              wordBreak: 'break-word',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              }
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px',
              }}
            >
              <Image
                styleSheet={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px',
                }}
                src={`https://github.com/${message.from}.png`}
              />
              <Text tag="strong" >
                {message.from}
              </ Text>
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {(new Date().toLocaleDateString())}
              </Text>
            </Box >
            <Box
              styleSheet={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              {message.text}
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  handleDeleteMessage(message);
                }}
                label="X"
                data-id={message.id}
                styleSheet={{
                  fontSize: '15px',
                  fontWeight: 'bold',
                  marginLeft: 'auto',
                  color: '#FFF',
                  backgroundColor: 'rgba(0,0,0,.5)',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
              </Button>
            </Box>
          </Text >

        )
      })}
    </Box >
  )
}