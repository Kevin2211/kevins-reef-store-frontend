import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { Button, Table } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { Store } from '../Store'
import { getError } from '../utils'


const reducer = (state, action) => {
    switch(action.type){
        case 'ORDER_REQUEST':
            return {...state, loading: true}
        case 'ORDER_SUCCESS':
            return {...state, orders: action.payload ,loading: false}
        case 'ORDER_FAIL':
            return {...state, loading: false, error: action.payload}
        default:
            return state
    }
}

export default function OrderHistoryScreen() {

    const { state } = useContext(Store)
    const { userInfo } = state
    const navigate = useNavigate()

    const [{loading, error, orders }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'ORDER_REQUEST' });
            try {
              const { data } = await axios.get(
                `/api/orders/myorders`,
      
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
              );

              dispatch({ type: 'ORDER_SUCCESS', payload: data });
            } catch (error) {
              dispatch({
                type: 'ORDER_FAIL',
                payload: getError(error),
              });
            }
          };
          fetchData();

    },[userInfo])

  return (
    <div className='container'>
        <Helmet>
            <title>Order History</title>
        </Helmet>
            <h1>Order History</h1>
           {loading ? (
            <LoadingBox></LoadingBox>
           ): error ? (
            <MessageBox variant='danger' > {error}</MessageBox>
           ) : (
            <Table responsive striped hover>
                <thead>
                    <tr>
                    <th>Order ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th>VIEW</th>
                    </tr>
                </thead>

                <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'No'}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="warning"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}

                </tbody>
            </Table>
           )} 
    </div>
  )
}
