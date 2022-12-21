import axios from 'axios';
import React, { useEffect, useReducer } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {toast} from 'react-toastify'
import { getError } from '../utils'
import { useContext } from 'react';
import { Store } from '../Store';

const reducer = (state,action) => {
    switch(action.type){
      case 'FETCH_REQUEST':
        return {...state, loading: true};
      case 'FETCH_SUCCESS':
        return{...state, products: action.payload, loading: false};
      case 'FETCH_FAIL':
        return {...state, loading: false, error: action.payload};
      default:
        return state;
    }
  }

export default function ProductListScreen() {
    const { state: {userInfo} } = useContext(Store)
    const [{loading, error, products}, dispatch] = useReducer(reducer, {
        products: [],
        loading: true, 
        error: ''
      })
    const navigate = useNavigate()
    
      useEffect(() => {
        const fetchData = async () => {
          dispatch({type: 'FETCH_REQUEST'})
          try {
            const result = await axios.get('/api/products')
            dispatch({type: 'FETCH_SUCCESS', payload: result.data})
    
          } catch (error) {
            dispatch({type: 'FETCH_FAIL', payload: error.message})
          }
        }
        fetchData()
      }, [])
    
        return ( 
            <div>
              <Helmet>
                <title>Product List</title>
              </Helmet>
            <h1>My products </h1>
            <div className='my-3 d-flex justify-content-end'>
              <Button variant='success' onClick={() => navigate('/admin/newproduct')}>
                <i className="fa fa-plus"></i>
              </Button>
            </div>
            <div className="products" >
            {
              loading ? (<LoadingBox />)
              :
              error ? (<MessageBox variant="danger">{error}</MessageBox>)
              :
            (
              
              <Row>
                {products.map((product) => {

                    const deleteHandler = async () => {
                        const confirmBox = window.confirm(
                            "Are you sure you want to delete this item from inventory?"
                          )
                          if (confirmBox === true) {
                            try {
                                const { data }  = await axios.delete(`/api/products/${product._id}/delete`,
                                {
                                    headers: {
                                        authorization: `Bearer ${userInfo.token}`
                                    }
                                }
                                )

                                dispatch({type: 'FETCH_SUCCESS', payload: data})
                                toast.success('Successful Deleted')

                            } catch (error) {
                                toast.error(getError(error))
                            }
                          }
                    }
                  return (
                    <Col key={product.slug} xs={6} sm={4} md={3} lg={2} className="mb-3">
                        <Card className='shadow border-0'>
                            <Link to={`/product/${product.slug}`}>
                                <img src={ product.image } className="card-img-top" alt={ product.name } />
                            </Link>
                            <Card.Body>
                                <Link className='nav-link' to={`/product/${product.slug}`}>
                                    <Card.Title> { product.name }</Card.Title>
                                </Link>
                                <Card.Subtitle className="mb-2 text-muted">{product.slug}</Card.Subtitle>
                                <Card.Text>Quantity: {product.countInStock}</Card.Text>
                                <Card.Text>Price per unit: ${product.price}</Card.Text>
                                <Link to={`/admin/${product._id}/edit`}><Button className='my-1 me-2' variant='info'>Edit</Button></Link>
                                <Button variant='danger' onClick={ deleteHandler }>Delete</Button>
                                </Card.Body>
                        </Card>
                    </Col>
                  )
                })}
    
              </Row>
            )
            }
            </div>
            </div>
         );
  
}
