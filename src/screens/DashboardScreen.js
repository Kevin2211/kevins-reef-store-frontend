import axios from 'axios'
import React, { useEffect } from 'react'
import { useContext, useReducer } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { Store } from '../Store'
import { getError } from '../utils'
import Chart from 'react-google-charts'

const reducer = (state,action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
           return {...state, loading: true}
    case 'FETCH_SUCCESS':
        return {...state, loading: false, summary: action.payload}
    case 'FETCH_ERROR':
        return {...state, loading: false, error: action.payload}   
        default:
            return state;
    }
}


export default function DashboardScreen() {
    const [{loading, summary, error}, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    })
    const { state } = useContext(Store)
    const { userInfo } = state

    useEffect(() => {
    
        const fetchData = async () => {
            try {
                const { data } = await axios.get('/api/orders/summary', {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                })
                dispatch({type: 'FETCH_SUCCESS', payload: data})
            } catch (error) {
                dispatch({type: 'FETCH_FAIL', payload: getError(error)})
            }
        }
        fetchData()

    }, [userInfo])
    
  return (
    <div>
        <h1>Seller Dashboard</h1>
        <Helmet>
            <title>Dashboard</title>
        </Helmet>
        {
            loading ? (<LoadingBox/>)
            : error ? (<MessageBox variant='danger'> {error}</MessageBox>)
            :
            (
                <div>
                    <Row>
                        <Col md={4} >
                            <Card className='text-center shadow px-2 pb-1 border-0 rounded mb-3'>
                                <Card.Body>
                                    <Card.Title>{summary.users && summary.users[0] ? summary.users[0].numUsers : 0}</Card.Title>
                                    <Card.Text>Users</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} >
                            <Card className='text-center shadow px-2 pb-1 border-0 rounded mb-3'>
                                <Card.Body>
                                    <Card.Title>{summary.orders[0] && summary.orders ? summary.orders[0].numOrders : 0}</Card.Title>
                                    <Card.Text>Orders</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} >
                            <Card className='text-center shadow px-2 pb-1 border-0 rounded mb-3'>
                                <Card.Body>
                                    <Card.Title>{summary.orders[0] && summary.orders ? '$' + summary.orders[0].totalSales.toFixed(2) : 0}</Card.Title>
                                    <Card.Text>Total Earning</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <div className='my-4 text-center shadow px-2 pb-1 border-0 rounded'>
                        <h2>Sales</h2>
                        {summary.dailyOrders.length === 0 
                        ? <MessageBox>No sale</MessageBox>
                        : (
                            <Chart
                            width="100%"
                            height="400px"
                            chartType="AreaChart"
                            loader={<LoadingBox/>}
                            data={[['Date','Sales'],
                            ...summary.dailyOrders.map((order) => [order._id, order.sales])]}>
                            </Chart>
                        )}
                    </div>
                    <div className="my-4 text-center shadow px-2 pb-1 border-0 rounded">
                        <h2>Categories</h2>
                        {summary.productCategories.length === 0 ? (
                        <MessageBox>No Category</MessageBox>
                        ) : (
                        <Chart
                            width="100%"
                            height="400px"
                            chartType="PieChart"
                            loader={<div>Loading Chart...</div>}
                            data={[
                            ['Category', 'Products'],
                            ...summary.productCategories.map((x) => [x._id, x.count]),
                            ]}
                        ></Chart>
                        )}
                    </div>
                </div>
            )
        }
    </div>
  )
}
