import React, { useContext, useEffect, useReducer, useState } from 'react'
import CheckoutBar from '../components/CheckoutBar'
import {Helmet} from 'react-helmet-async'
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import { Store } from '../Store'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import axios from 'axios'
import LoadingBox from '../components/LoadingBox'
import { PayPalButtons, usePayPalScriptReducer} from '@paypal/react-paypal-js'




const reducer = (state,action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return {...state, loading: true}
        case 'CREATE_SUCCESS':
            return {...state, loading: false,  order: { ...state.order, _id: action.payload}}
        case 'CREATE_FAIL':
            return {...state, loading: false}
        case 'PAY_REQUEST':
            return {...state, loadingPay: true}
        case 'PAY_SUCCESS':
            return {...state, loadingPay: false, successPay: true}
        case 'PAY_FAIL:':
            return {...state, loadingPay: false, errorPay: action.payload}
        case 'PAY_RESET':
              return {...state, loadingPay: false, successPay: false}
        default:
            return state;
    }
}


export default function PlaceOrderScreen () {


    const { state: {cart, userInfo}, dispatch: contextDispatch } = useContext(Store)
    const navigate = useNavigate()
    const roundNumber = (num) => {
        return Math.round(num * 100 + Number.EPSILON) / 100
    }

    cart.itemsPrice = roundNumber(
        cart.cartItems.reduce((a,b) => a + b.quantity * b.price , 0)
    )

    cart.shippingPrice = cart.itemsPrice > 250 ? roundNumber(0) : roundNumber(45)

    cart.taxPrice = roundNumber(0.15 * cart.itemsPrice)
    
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice + cart.taxPrice
    const [orderId, setOrderId] = useState('')

    
    const [{ loading, error, order, successPay, loadingPay }, dispatch ] = useReducer(reducer, {
        order: {totalPrice: cart.totalPrice, _id: ''},
        loading: false,
        error: '',
        successPay: false,
        loadingPay: false
    })
    

    const placeOrderHandler = async (details) => {
            try {
                dispatch({type: 'CREATE_REQUEST'})
                const { data } = await axios.post('/api/orders', {
                    orderItems: cart.cartItems,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: cart.shippingPrice,
                    taxPrice: cart.taxPrice,
                    totalPrice: cart.totalPrice,
                    id: details.id,
                    status: details.status,
                    update_time: details.update_time,
                    email_address: details.email_address
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                })

                contextDispatch({type: 'CART_CLEAR'})
                dispatch({type: 'CREATE_SUCCESS'})
                localStorage.removeItem('cartItems')

                 navigate(`/order/${data.newOrder._id}`)

            } catch (error) {
                dispatch({type: 'CREATE_FAIL'})
                toast.error(getError(error))
            }
    }

    const [{ isPending }, paypalDispatch ] = usePayPalScriptReducer()

    const createOrder = (data, actions ) =>{
        return actions.order.create({
          purchase_units: [
            {
              amount: {value: order.totalPrice}
            }
          ]
        }).then((orderID) => {
          return orderID
        })
      }
      
      function onApprove (data, actions) {
        return actions.order.capture().then(async function (details) {
          try {
            dispatch({type: 'PAY_REQUEST'})

            placeOrderHandler(details)

            toast.success('Successfully submitted payment')
            dispatch({type: 'PAY_SUCCESS'})

          } catch (error) {
            dispatch({ type: 'PAY_FAIL', payload: getError(error)})
            toast.error(getError(error))
          }
        })
      }
  
      function onError(error) {
        toast.error(getError(error))
      }
    useEffect(() => {
        if(!cart.paymentMethod){
            navigate('/payment')
        }
        const loadPaypalScript = async () => {

            const { data: clientId } = await axios.get(`/api/keys/paypal`, {
              headers: {authorization: `Bearer ${userInfo.token}`}
            })

            paypalDispatch({
              type: 'resetOptions',
              value: {
                'client-id': clientId,
                currency: 'USD'
              }
            })

            paypalDispatch({type: 'setLoadingStatus', value: 'pending'})

          }


          loadPaypalScript()
    }, [cart, navigate, paypalDispatch, successPay, userInfo])
    

  return (
    <div className='container'>
        <CheckoutBar step1 step2 step3 step4></CheckoutBar>
        <Helmet>
            <title>Preview Order</title>
        </Helmet>
        <h1 className='my-3'>Preview Order</h1>
        <Row>
            <Col md={8} >
                <Card className='mb-3'>
                    <Card.Body>
                        <Card.Title>Shipping</Card.Title>
                        <Card.Text>
                            <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                            <strong>Address: </strong> {cart.shippingAddress.address1}, {cart.shippingAddress.address2}, {cart.shippingAddress.city}, {cart.shippingAddress.stateInfo}, {cart.shippingAddress.postalCode} <br />
                            <strong>Note: </strong>{cart.shippingAddress.note}
                        </Card.Text>
                        <Link className='nav-link' to='/shipping'>Edit</Link>

                    </Card.Body>
                </Card>
                <Card className='mb-3'>
                    <Card.Body>
                        <Card.Title>Payment</Card.Title>
                        <Card.Text>
                            <strong>Payment Method:</strong> {cart.paymentMethod} <br/>
                        </Card.Text>
                        <Link className='nav-link' to='/payment'>Edit</Link>

                    </Card.Body>
                </Card>
                <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link className='nav-link' to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        Quantity: <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>Price: ${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link className='nav-link' to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
            <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <Row>
                            <Col>Subtotal: </Col>
                            <Col>${cart.itemsPrice.toFixed(2)}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Shipping: </Col>
                            <Col>${cart.shippingPrice.toFixed(2)}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Tax: </Col>
                            <Col>${cart.taxPrice.toFixed(2)}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col> <strong>Total: </strong> </Col>
                            <Col>${cart.totalPrice.toFixed(2)}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <div className='d-grid'>
                            <ListGroup.Item>
                                {isPending ? (
                                <LoadingBox />
                                ) : 
                                <div>
                                <PayPalButtons
                                createOrder={createOrder}
                                onApprove={onApprove}
                                onError={onError}>

                                </PayPalButtons>
                                </div>}
                            </ListGroup.Item>

                            <Button className='my-3' type='button' 
                            onClick={() => navigate('/cart')}
                            >
                                Back To Shopping Cart
                            </Button>
                        </div>
                        <div className='d-grid'>
                        {loading && <LoadingBox /> }

                        </div>
                    </ListGroup.Item>
                    { loadingPay && <LoadingBox />}
                </ListGroup>
            </Card.Body>
        </Col>
        </Row>
    </div>
  )
}
