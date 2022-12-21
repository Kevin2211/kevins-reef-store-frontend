import axios from 'axios'
import React, { useEffect } from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Store } from '../Store'
import { getError } from '../utils'

export default function SigninScreen() {
    const navigate = useNavigate()
    const { search } = useLocation()
    const redirectInUrl = new URLSearchParams(search).get('redirect')
    const redirect = redirectInUrl ? redirectInUrl : '/'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { state, dispatch: contextDispatch } = useContext(Store)
    const userInfo = state.userInfo
    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post('/api/users/signin', {
                email,
                password
            })
            contextDispatch({type: 'USER_SIGNIN', payload: data})
            localStorage.setItem('userInfo', JSON.stringify(data))
            navigate(redirect || '/')
        } catch (error) {
            toast.error(getError(error))
        }
    }
    useEffect(() => {
        if(userInfo){
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])

  return (
    <Container className="small-container">
        <Helmet>
            <title>Sign In</title>
        </Helmet>
        <h1 className='my-3'>Sign In</h1>
        <Form onSubmit={ submitHandler }>
            <Form.Group className='mb-3' controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' onChange={(e) => setEmail(e.target.value)} required></Form.Control>
            </Form.Group>
            <Form.Group className='mb-3' controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password'  onChange={(e) => setPassword(e.target.value)} required></Form.Control>
            </Form.Group>
            <div className='mb-3'>
                <Button variant='secondary' type='submit'>Sign In</Button>
            </div>
            <div className='mb-3'>
                New customer? {' '}
                <Link className='nav-link' to={`/signup?redirect=${redirect}`}>Create your account</Link>
            </div>
        </Form>
    </Container>
  )
}
