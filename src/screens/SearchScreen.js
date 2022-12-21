import React, { useEffect, useReducer, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { getError } from '../utils';
import { toast } from 'react-toastify'
import axios from 'axios'
import { Helmet } from 'react-helmet-async'
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';
import Product from "../components/Product";
import { LinkContainer } from 'react-router-bootstrap'



const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
          return { ...state, loading: true };
        case 'FETCH_SUCCESS':
          return {
            ...state,
            products: action.payload.products,
            page: action.payload.page,
            pages: action.payload.pages,
            countProducts: action.payload.countProducts,
            loading: false,
          };
        case 'FETCH_FAIL':
          return { ...state, loading: false, error: action.payload };
    
        default:
          return state;
      }
}

const prices = [
    {
        name: '$1-$100',
        value: '1-100'
    },
    {
        name: '$101-$200',
        value: '101-200'
    },
    {
        name: '$201-$500',
        value: '201-500'
    }
]
const careLevels = [
    {
        name: 'Easy',
        value: 1
    },
    {
        name: 'Moderate',
        value: 2
    },
    {
        name: 'Dedicated',
        value: 3
    },
    {
        name: 'Expert',
        value: 4
    }
]

export default function SearchScreen() {

    const navigate = useNavigate()
    const { search } = useLocation()
    const sp = new URLSearchParams(search)
    const category = sp.get('category') || 'all'
    const query = sp.get('query') || 'all'
    const price = sp.get('price') || 'all'
    const careLevel = sp.get('careLevel') || 'all'
    const order = sp.get('order') || 'newest'
    const page = sp.get('page') || 1


    const [{ loading, error, products, pages, countProducts}, dispatch] = 
    useReducer(reducer, {
        loading: true,
        error: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(
                    `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&careLevel=${careLevel}&order=${order}`
                )
                dispatch({ type: 'FETCH_SUCCESS', payload: data})
                
            } catch (error) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(error)
                })
            }
        }
        fetchData()
    },[careLevel, category, order, page, price, query])

    const [categories, setCategories] = useState([])
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data }= await axios.get(`/api/products/categories`)
                setCategories(data)
            } catch (error) {
                toast.error(getError(error))
            }

        }
        fetchCategories()
    },[dispatch])

    const getFilterUrl = (filter) => {
        const filterPage = filter.page || page
        const filterCategory = filter.category || category
        const filterCareLevel = filter.careLevel || careLevel
        const filterPrice = filter.price || price
        const sortOrder = filter.order || order
        const filterQuery = filter.query || query
        return {
            
              pathname: "/search",
              search: `?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&careLevel=${filterCareLevel}&order=${sortOrder}&page=${filterPage}`
            
          }
        // return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterCareLevel}&order=${sortOrder}&page=${filterPage}`;
    }
  return (
    <div>
        <Helmet>
            <title>Search Results</title>
        </Helmet>
        <Row>
            <Col md={3}>
                <Row>
                    <Col xs={'auto'} md={12}>
                        <div className='shadow-sm px-2 pb-1 border-0 rounded mb-3'>
                        <h3>Categories</h3>
                            <ul>
                                <li >
                                    <Link
                                    className={'all' === category ? 'text-bold nav-link' : 'nav-link '}
                                    to={getFilterUrl}>
                                        Any
                                    </Link>
                                </li>
                                {categories.map((c) => (
                                    <li key={c}>
                                        <Link
                                        className={c === category ? 'text-bold nav-link' : 'nav-link'}
                                        to={getFilterUrl({category: c})}>
                                            {c}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </Col>
                    <Col xs={'auto'} md={12}>
                    <div className='shadow-sm px-2 pb-1 border-0 rounded mb-3'>
                        <h3>Price</h3>
                            <ul>
                                <li>
                                <Link
                                        className={'all' === price ? 'text-bold nav-link' : 'nav-link'}
                                        to={getFilterUrl({ price: 'all'})}>
                                            Any
                                        </Link>
                                </li>
                                {prices.map((p) => (
                                        <li key={p.value}>
                                            <Link
                                            className={p.value === price ? 'text-bold nav-link' : 'nav-link'}
                                            to={getFilterUrl({price: p.value})}
                                            >
                                                {p.name}
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </Col>
                    <Col xs={'auto'} md={12}>
                    <div className='shadow-sm px-2 pb-1 border-0 rounded mb-3'>
                            <h3>Care Level:</h3>
                            <ul>
                                    {careLevels.map((care) => (
                                                    <li key={care.value}>
                                                        <Link
                                                        className={`${care.value}` === `${careLevel}` ? 'text-bold nav-link' : 'nav-link'}
                                                        to={getFilterUrl({careLevel: care.value})}
                                                        >
                                                            {care.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                                <li>
                                    <Link
                                    to={getFilterUrl({ careLevel: 'all' })}
                                    className={careLevel === 'all' ? 'text-bold nav-link' : 'nav-link'}
                                    >
                                    All Levels
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </Col>

                </Row>
            </Col>
            <Col md={9}>
                {
                    loading ? (
                        <LoadingBox></LoadingBox>
                    )
                    : error ?
                    (
                        <MessageBox variant='danger'>{error}</MessageBox>
                    ):(
                       <>
                       <Row className='justify-content-between mb-3'>
                            <Col md={6}>
                                <div>
                                {countProducts === 0 ? 'No' : countProducts} Results
                                {query !== 'all' && ' : ' + query}
                                {category !== 'all' && ' : ' + category}
                                {price !== 'all' && ' : Price ' + price}
                                {careLevel !== 'all' && ' : Care Level ' + careLevels[careLevel - 1].name }
                                {query !== 'all' ||
                                category !== 'all' ||
                                price !== 'all' ? (
                                <Button
                                    variant="light"
                                    onClick={() => navigate('/search')}
                                    className='ms-2'
                                >
                                    <i className="fas fa-times-circle "></i>
                                </Button>
                                ) : null}
                                </div>
                            </Col>
                            <Col className='text-end'>
                                    Sort by {' '}
                                    <select
                                        value={order}
                                        onChange={(e) => {
                                        navigate(getFilterUrl({ order: e.target.value }));
                                        }}
                                    >
                                        <option value="newest">Newest Arrivals</option>
                                        <option value="lowest">Price: Low to High</option>
                                        <option value="highest">Price: High to Low</option>

                                    </select>
                            </Col>

                       </Row>
                       {products.length === 0 && (
                            <MessageBox>No Product Found</MessageBox>
                        )}

                        <Row>
                            {products.map((product) => (
                            <Col sm={6} lg={4} className="mb-3" key={product._id}>
                                <Product product={product}></Product>
                            </Col>
                            ))}
                        </Row>
                        <div>
                            {[...Array(pages).keys()].map((x) => (
                            <LinkContainer
                                key={x + 1}
                                className="mx-1"
                                to={getFilterUrl({ page: x + 1 })}
                            >
                                <Button
                                className={Number(page) === x + 1 ? 'text-bold' : ''}
                                variant="light"
                                >
                                {x + 1}
                                </Button>
                            </LinkContainer>
                            ))}
                        </div>

                       </>
                    )
                }
            </Col>
        </Row>
    </div>
  )
}
