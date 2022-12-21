import React, { useState } from 'react'
import { Button, FormControl, InputGroup, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function SearchBox() {
    const navigate = useNavigate()

    const [query, setQuery] = useState('')
    const submitHandler = (e) => {
        e.preventDefault()
        navigate(query ? `/search/?query=${query}` : '/search')
    }
  return (
   <Form className='d-flex m-auto my-1' onSubmit={submitHandler}>
        <InputGroup>
            <FormControl type="text"

            name="q"
            id="q"
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search corals ...'
            aria-describedby='button-search'
            aria-label='Search Corals'>
            
            </FormControl>
            <Button variant='outline-primary' type='submit' id='button-search'>
                <i className='fas fa-search'></i>
            </Button>
        </InputGroup>
   </Form>
  )
}
