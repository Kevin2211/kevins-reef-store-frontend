import React, { useEffect,useState,useRef } from 'react'
import { Button, Card, Col, Form, ListGroup, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import socketIOClient from 'socket.io-client'

const ENDPOINT = window.location.host.indexOf('localhost') >= 0
                ? 'http://127.0.0.1:2000'
                : window.location.host

export default function ChatBox(props) {
    const { userInfo }= props
    const [socket, setSocket] = useState(null)
    const uiMessagesRef = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    const [messageBody, setMessageBody] = useState('');
    const [messages, setMessages] = useState([
      { name: 'Admin', body: 'Hello there, Please ask your question.' },
    ]);
  
    useEffect(() => {
        if(userInfo){
            if (uiMessagesRef.current) {
              uiMessagesRef.current.scrollBy({
                top: uiMessagesRef.current.clientHeight,
                left: 0,
                behavior: 'smooth',
              });
            }
            if (socket) {
              socket.emit('onLogin', {
                _id: userInfo._id,
                name: userInfo.name,
                isAdmin: userInfo.isAdmin,
              });
              socket.on('message', (data) => {
                setMessages([...messages, { body: data.body, name: data.name }]);
              });
            }
        }
    }, [messages, isOpen, socket, userInfo]);
  

    const supportHandler = () => {
      setIsOpen(true);
      console.log(ENDPOINT);
      const sk = socketIOClient(ENDPOINT);
      setSocket(sk);
    };



    const submitHandler = (e) => {
      e.preventDefault();
      if (!messageBody.trim()) {
        alert('Error. Please type message.');
      } else {
        setMessages([...messages, { body: messageBody, name: userInfo.name }]);
        setMessageBody('');
        setTimeout(() => {
          socket.emit('onMessage', {
            body: messageBody,
            name: userInfo.name,
            isAdmin: userInfo.isAdmin,
            _id: userInfo._id,
          });
        }, 1000);
      }
    };


    const closeHandler = () => {
      setIsOpen(false);
    };

    
    return (
      <div className="chatbox">
        {!isOpen ? (
          <Button variant='secondary' size='lg' type="button" onClick={supportHandler}>
            <i className="fa fa-comments"></i>
          </Button>
        ) : userInfo === null ?
        (
            <div>
                <Card border='secondary' className='shadow '>
                        <Card.Header>
                            <div className='d-flex justify-content-between border-1'>
                                <h4 className='m-1'>Live Support </h4>
                                <Button type="button" variant='secondary' onClick={closeHandler}>
                                <i class="indicator fa fa-chevron-circle-down" aria-hidden="true"></i>
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body className='d-flex'>
                            Please <Link className='nav-link mx-2' to='/signin'>Sign in</Link> or <Link className='nav-link mx-2' to='/signup'>Sign up</Link> to send a message
                        </Card.Body>

                </Card>
            </div>
        )
        :
        (
            
            <div>
                <Card border='secondary' className='shadow '>
                    <Card.Header>
                        <div className='d-flex justify-content-between border-1'>
                            <h4 className='m-1'>Live Support </h4>
                            <Button type="button" variant='secondary' onClick={closeHandler}>
                            <i className="indicator fa fa-chevron-circle-down" aria-hidden="true"></i>
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <ul variant='flush' ref={uiMessagesRef}>
                        {messages.map((msg, index) => (
                            <li key={index}>
                            <strong>{`${msg.name}: `}</strong> {msg.body}
                            </li>
                        ))}
                        </ul>
                    </Card.Body>
                        <div className='text-center'>
                            <Form  onSubmit={submitHandler} >
                                <div className='d-flex'>

                                        <Form.Group>
                                            <Form.Control
                                            value={messageBody}
                                            onChange={(e) => setMessageBody(e.target.value)}
                                            type="text"
                                            placeholder="Type a message"
                                            className='chatbox-input'
                                        />
                                        </Form.Group>
                                        <Button className='' variant='primary'  type="submit"><i className="fa fa-paper-plane"></i></Button>
                                </div>
                            </Form>
                        </div>
                </Card>
            </div>
        )}
      </div>
    );
  }
