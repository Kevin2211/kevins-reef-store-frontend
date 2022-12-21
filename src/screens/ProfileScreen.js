import React, { useContext, useReducer } from 'react'
import { useState } from 'react'
import { Button, Form, Toast } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import { getError } from '../utils'
import { toast } from 'react-toastify'
import axios from 'axios'

const reducer = (state, action) => {
    switch(action.type){
        case 'UPDATE_REQUEST':
            return {...state, loading: true}
        case 'UPDATE_SUCCESS':
            return {...state, loading: false}
        case 'UPDATE_FAIL':
            return {...state, loading: false, errorState: action.payload}
        default:
            return state
    }
}

export default function ProfileScreen() {

    const navigate = useNavigate()
    const { state, dispatch: contextDispatch } = useContext(Store)
    const { userInfo } = state
    const [name, setName] = useState(userInfo.name)
    const [email, setEmail] = useState(userInfo.email)
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    
    
    const [{loading, errorState}, dispatch] = useReducer(reducer, {
        loading: false,
        error: ''
    })

    const submitHandler = async (e) => {
        e.preventDefault()
        if(password !== passwordConfirm){
            toast.error('Passwords do not match!')
            return
        }
        dispatch({type: 'UPDATE_REQUEST'})
        try {
            const { data } = await axios.put('/api/users/myprofile',
            {
                name,
                email,
                password
            },
            {
                headers: { Authorization: `Bearer ${userInfo.token}`}
            })
            dispatch({type: 'UPDATE_SUCCESS'})
            contextDispatch({ type: 'USER_SIGNIN', payload: data})
            localStorage.setItem('userInfo', JSON.stringify(data))
            toast.success('User updated successfully')
        } catch (error) {
            dispatch({type: 'UPDATE_FAIL', payload: getError(error)})
            toast.error(errorState)
        }
    }

  return (
    <div className='container small-container'>
        <Helmet>
            <title>User Profile</title>
        </Helmet>
        <h1 className='my-3'>My profile</h1>
        <form onSubmit={submitHandler}>
            <Form.Group className='mb-3' controlId='name'>
                <Form.Label>Name:</Form.Label>
                <Form.Control 
                value={name}
                onChange={(e) => setName(e.target.value)} required></Form.Control>
            </Form.Group>
            <Form.Group className='mb-3' controlId='email'>
                <Form.Label>Email:</Form.Label>
                <Form.Control 
                value={email}
                onChange={(e) => setEmail(e.target.value)} required></Form.Control>
            </Form.Group>

            <Form.Group className='mb-3' controlId='password'>
                <Form.Label>Password:</Form.Label>
                <Form.Control 
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)} ></Form.Control>
            </Form.Group>
            <Form.Group className='mb-3' controlId='passwordConfirm'>
                <Form.Label>Confirm Password:</Form.Label>
                <Form.Control 
                type='password'
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)} ></Form.Control>
            </Form.Group>
            <div className='mb-3'>
                <Button type='submit'>Update</Button>
                <Button className='mx-3' variant='danger' onClick={() => navigate(-1)}>Cancel</Button>
            </div>
        </form>

    </div>
  )
}
