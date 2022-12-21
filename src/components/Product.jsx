import axios from 'axios'
import React from 'react'
import { useContext } from 'react'
import { Button, Card, ProgressBar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Store } from '../Store'

const care = ['Easy', 'Moderate', 'Intermediate', 'Dedicated', 'Expert']
const light = ['Low', 'Moderate', 'Medium', 'High', 'Extra High']
const flow = ['Low', 'Moderate', 'Medium', 'High', 'Extra High']


export default function Product(props) {
    const { product } = props
    const { state, dispatch: contextDispatch } = useContext(Store)

    const addToCartHandler = async () => {
        const existItem = state.cart.cartItems.find(item => product._id === item._id)
        const quantity = existItem ? existItem.quantity + 1 : 1
        const { data } = await axios.get(`/api/products/${product._id}`) 
            if( data.countInStock < quantity) {
                window.alert('Sorry. This product is out of stock')
                return
            }
        contextDispatch({
            type: 'CART_ADD_ITEM', 
            payload: {...product, quantity}
        })
        console.log(state)
      }

  return (
    <Card className='shadow border-0'>
        <Link to={`/product/${product.slug}`}>
            <img src={ product.image } className="card-img-top" alt={ product.name } />
        </Link>
        <Card.Body>
            <Link className='nav-link' to={`/product/${product.slug}`}>
                <Card.Title> { product.name }</Card.Title>
            </Link>
            <Card.Text>${product.price}</Card.Text>
            <Card.Text><i className="fa fa-heart"></i> Care Level 
            <ProgressBar animated variant='danger' label={care[product.careLevel - 1]} now={product.careLevel/5 * 100}></ProgressBar>
            </Card.Text>
            {/* <Card.Text><i className="fa fa-sun"></i> Lighting 
            <ProgressBar animated variant='warning' label={light[product.lighting - 1]} now={product.lighting/5 * 100}></ProgressBar>
            </Card.Text>
            <Card.Text><i class="fa fa-wind"></i> Flow
            <ProgressBar animated variant='info' label={flow[product.flow - 1]} now={product.flow/5 * 100}></ProgressBar>
            </Card.Text> */}
            { product.countInStock === 0 ? <Button disabled >Out of Stock</Button> : <Button onClick={ addToCartHandler }>Add to cart</Button>}
        </Card.Body>
  </Card>
  )
}
