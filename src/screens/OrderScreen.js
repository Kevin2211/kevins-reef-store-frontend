import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { useReducer } from 'react'
import { Card, Col, ListGroup, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import {  Link, useNavigate, useParams } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { Store } from '../Store'
import { getError } from '../utils'
import { PayPalButtons, usePayPalScriptReducer} from '@paypal/react-paypal-js'
import { toast } from 'react-toastify'

const reducer = (state,action) => {
    switch (action.type){
        case 'ORDER_REQUEST':
            return {...state, loading: true}
        case 'ORDER_SUCCESS':
            return {...state, order: action.payload ,loading: false}
        case 'ORDER_FAIL':
            return {...state, loading: false, error: action.payload}
        case 'PAY_REQUEST':
            return {...state, loadingPay: true}
        case 'PAY_SUCCESS':
          return {...state, loadingPay: false, successPay: true}
        case 'PAY_FAIL:':
          return {...state, loadingPay: false, errorPay: action.payload}
        case 'PAY_RESET':
          return {...state, loadingPay: false, successPay: false}
        default:
            return state
    }
}
export default function OrderScreen() {


    const [{loading, error, order, successPay, loadingPay}, dispatch] = useReducer(reducer, 
      {loading: true,
        error: '',
        order: {},
        successPay: false,
        loadingPay: false},
    )
    const params = useParams()
    const { id: orderId} = params
    const { state: { userInfo}, dispatch: contextDispatch } = useContext(Store)
    const navigate = useNavigate()

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
    
    function onApprove(data, actions) {
      return actions.order.capture().then(async function (details) {
        try {
          dispatch({type: 'PAY_REQUEST'})
          const { data } = await axios.put(
            `/api/orders/${order._id}/pay`,
            details,
            {
              headers: {authorization: `Bearer ${userInfo.token}`}
            }
          )
          dispatch({type: 'PAY_SUCCESS', payload: data})
          toast.success('Successfully submitted payment')
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

      //function to fetch order from database
        const fetchData = async () => {
            dispatch({type: 'ORDER_REQUEST'})
            try {
                const {data} = await axios.get(`/api/orders/${orderId}`,
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                })
                
                dispatch({type: 'ORDER_SUCCESS', payload: data } )
            } catch (error) {
                dispatch({type: 'ORDER_FAIL', payload: getError(error)})
            }
        }

        //if user not logged in redirect to login page
        if(!userInfo){
            return navigate('/login') 
        }

        //if order state hook is empty fetch the data 
        if(!order._id || successPay || (order._id && order._id !== orderId)){

          fetchData()

          if(successPay){
            dispatch({type: 'PAY_RESET'})
          }

        }else {

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
        }
        


    }, [ navigate, orderId, userInfo, order, paypalDispatch, successPay])
    


  return (
      loading ? ( <LoadingBox></LoadingBox>)
      : error ? ( <MessageBox variant='danger' > { error }</MessageBox> )
      : (
        <div>
          <Helmet>
            <title>Order {orderId}</title>
          </Helmet>
          <h1 className="my-3">Order ID:  {orderId}</h1>
          <Row>
            <Col md={8}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Shipping</Card.Title>
                  <Card.Text>
                    <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                    <strong>Address: </strong> {order.shippingAddress.address1}
                    {order.shippingAddress.address2 ? order.shippingAddress.address2 : ' '}, 
                    {order.shippingAddress.city}, {order.shippingAddress.stateInfo}, {order.shippingAddress.postalCode} <br />
                    <strong>Note: </strong>{order.shippingAddress.note ? order.shippingAddress.note : 'N/A'}
                  </Card.Text>
                  {order.isDelivered ? (
                    <MessageBox variant="success">
                      Delivered at {order.deliveredAt}
                    </MessageBox>
                  ) : (
                    <MessageBox variant="danger">Not Delivered</MessageBox>
                  )}
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Payment</Card.Title>
                  <Card.Text>
                    <strong>Method:</strong> {order.paymentMethod}
                  </Card.Text>
                  {order.isPaid ? (
                    <MessageBox variant="success">
                      Paid at {order.paidAt}
                    </MessageBox>
                  ) : (
                    <MessageBox variant="danger">Not Paid</MessageBox>
                  )}
                </Card.Body>
              </Card>
    
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Items</Card.Title>
                  <ListGroup variant="flush">
                    {order.orderItems.map((item) => (
                      <ListGroup.Item key={item._id}>
                        <Row className="align-items-center">
                          <Col md={6}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="img-fluid rounded img-thumbnail"
                            ></img>{' '}
                            <Link to={`/product/${item.slug}`}>{item.name}</Link>
                          </Col>
                          <Col md={3}>
                            <span>{item.quantity}</span>
                          </Col>
                          <Col md={3}>${item.price}</Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Order Summary</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Items</Col>
                        <Col>${order.itemsPrice.toFixed(2)}</Col>
                        </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Subtotal: </strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
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
                )}
                { loadingPay && <LoadingBox />}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
  )
}