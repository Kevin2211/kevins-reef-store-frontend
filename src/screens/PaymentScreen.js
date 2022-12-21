import React, { useContext, useState } from 'react'
import CheckoutBar from '../components/CheckoutBar'
import { Helmet } from 'react-helmet-async'
import { Button, Form } from 'react-bootstrap'
import { Store } from '../Store'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PaymentScreen() {
    const navigate = useNavigate()
    const { state ,dispatch: contextDispatch} = useContext(Store)
    const { cart:{ shippingAddress, paymentMethod } } = state

    const [ paymentMethodName, setPaymentMethodName] = useState(
        paymentMethod || 'Paypal'
    )


    useEffect(() => {
        if(!shippingAddress){
            navigate('/shipping')
        }
    },[shippingAddress, navigate])


    const handleSubmit = (e) => {
        e.preventDefault()
        contextDispatch({
            type: 'SAVE_PAYMENT_METHOD',
            payload: paymentMethodName
        })
        localStorage.setItem('paymentMethod', paymentMethodName)

        navigate('/placeorder')
    }
  return (

    
    <div className='container'>
        <CheckoutBar step1 step2 step3></CheckoutBar>
        <div className='container small-container'>
            <Helmet>
                <title>Payment Method</title>
            </Helmet>
            <h1 className='my-3'>Payment Method</h1>
            <Form onSubmit={ handleSubmit }>
                <div className='mb-3'>
                    <Form.Check
                        type='radio'
                        id='Paypal'
                        label='Paypal'
                        value='Paypal'
                        checked={paymentMethodName === 'Paypal'}
                        onChange={(e) => setPaymentMethodName(e.target.value)}
                    >
                    </Form.Check>
                    <Form.Check
                        type='radio'
                        id='Stripe'
                        label='Stripe'
                        value='Stripe'
                        checked={paymentMethodName === 'Stripe'}
                        onChange={(e) => setPaymentMethodName(e.target.value)}
                    >
                    </Form.Check>
                </div>
                <Button className='me-3' onClick={() => navigate(-1)}>Go back</Button>
                <Button variant='secondary' type='submit'>Continue</Button>
            </Form>
        </div>
    </div>
  )
}
