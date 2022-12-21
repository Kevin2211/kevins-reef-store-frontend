import axios from 'axios'
import React, { useEffect, useReducer } from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingBox from '../components/LoadingBox'
import { Store } from '../Store'
import { getError } from '../utils'

const reducer = (state, action) => {
    switch(action.type){
        case 'UPLOAD_REQUEST':
            return {...state, loadingImage: true, error: ''}
        case 'UPLOAD_SUCCESS':
            return {...state, loadingImage: false, error: ''}
        case 'UPLOAD_FAIL':
            return {...state, loadingImage: false, error: action.payload}
        default:
            return state
    }
}

export default function EditProductScreen() {
    const navigate = useNavigate()
    const params = useParams()
    const { id } = params
    const { state } = useContext(Store)
    const { userInfo } = state


    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [image, setImage] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [careLevel, setCareLevel] = useState(0)
    const [lightLevel, setLightLevel] = useState(0)
    const [flowLevel, setFlowLevel] = useState(0)
    const [countInStock, setCountInStock] = useState()
    const [price, setPrice] = useState()


    const [{loadingImage, error}, dispatch] = useReducer(reducer, {
        loadingImage: false,
        error: ''
    })


    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.put(`/api/products/${id}/edit`, {
                name,
                slug,
                image,
                category,
                description,
                careLevel,
                countInStock,
                price,
                flowLevel,
                lightLevel
            }, {
                    headers: {
                        authorization : `Bearer ${ userInfo.token}`
                    }
            })


            navigate('/admin/productlist')
        } catch (error) {
            toast.error(getError(error.message))
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`)

                setName(data.name)
                setSlug(data.slug)
                setImage(data.image)
                setCategory(data.category)
                setDescription(data.description)
                setCareLevel(data.careLevel)
                setCountInStock(data.countInStock)
                setPrice(data.price)
                setFlowLevel(data.flow)
                setLightLevel(data.lighting)

            } catch (error) {
                toast.error(getError(error))
            }
        }

        fetchData()
    },[id])

    const uploadFileHandler = async (e, forImages) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        try {
          dispatch({ type: 'UPLOAD_REQUEST' });
          const { data } = await axios.post('/api/upload', bodyFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              authorization: `Bearer ${userInfo.token}`,
            },
          });

          dispatch({ type: 'UPLOAD_SUCCESS' });
          toast.success('Image uploaded successfully');
          setImage(data.secure_url)
        } catch (err) {
          toast.error(getError(err));
          dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
        }
      };


  return (
    <Container className="small-container">
        <Helmet>
            <title>Edit Product</title>
        </Helmet>
        <h1 className='my-3'>Edit Product</h1>
        <Form  onSubmit={submitHandler}>
            <Form.Group className='mb-3' controlId='name'>
                <Form.Label>Name:</Form.Label>
                <Form.Control type='text' onChange={(e) => setName(e.target.value)} value={name} required></Form.Control>
            </Form.Group>
            <Form.Group className='mb-3' controlId='slug'>
                <Form.Label>Slug:</Form.Label>
                <Form.Control type='text' onChange={(e) => setSlug(e.target.value)} value={slug} required></Form.Control>
            </Form.Group>
            <Form.Group className='mb-3' controlId='imageFile'>
                <Form.Label>Upload:</Form.Label>
                <Form.Control type='file' onChange={uploadFileHandler}></Form.Control>
                {loadingImage &&  <LoadingBox></LoadingBox> }
            </Form.Group>
            <Form.Group className='mb-3' controlId='password'>
                <Form.Label>Image URL:</Form.Label>
                <Form.Control type='text'  onChange={(e) => setImage(e.target.value)} value={image} required></Form.Control>
            </Form.Group>
            <Form.Group className='mb-3' controlId='category'>
                <Form.Label>Category:</Form.Label>
                <Form.Select className='w-50' aria-label="Category"  type='number'  onChange={(e) => setCategory(e.target.value)} required>
                    <option>{category}</option>
                    <option value={'LPS'}>LPS</option>
                    <option value={'SPS'}>SPS</option>
                    <option value={'Softie'}>Softie</option>
                    <option value={'Anemone'}>Anemone</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className='mb-3' controlId='description'>
                <Form.Label>Description:</Form.Label>
                <Form.Control style={{ height: '100px' }} as="textarea"  onChange={(e) => setDescription(e.target.value)} value={description} required></Form.Control>
            </Form.Group>
            <Form.Group className='mb-3 d-flex flow-row justify-content-between' controlId='careLevel'>
            <Form.Label>Care</Form.Label>
                <Form.Select className='w-25' aria-label="Care Level"  type='number'  onChange={(e) => setCareLevel(e.target.value)} required>
                    <option>{careLevel}</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </Form.Select>
            <Form.Label>Light</Form.Label>
                <Form.Select className='w-25' aria-label="Lighting Level"  type='number'  onChange={(e) => setLightLevel(e.target.value)} required>
                    <option>{lightLevel}</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </Form.Select>
            <Form.Label>Flow</Form.Label>
                <Form.Select className='w-25' aria-label="Flow Level"  type='number'  onChange={(e) => setFlowLevel(e.target.value)} required>
                    <option>{flowLevel}</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className='mb-3' controlId='countInStock'>
                <Form.Label>Quantity:</Form.Label>
                <Form.Control type='number'  onChange={(e) => setCountInStock(e.target.value)} value={countInStock} required></Form.Control>
            </Form.Group>
            <Form.Group className='mb-3' controlId='price'>
                <Form.Label>Price:</Form.Label>
                <Form.Control type='number'  onChange={(e) => setPrice(e.target.value)} value={price} required></Form.Control>
            </Form.Group>
            <div className='mb-3'>
                <Button type='submit' variant='secondary'>Submit</Button>
            </div>
        </Form>
            <div className='mb-3'>
                <Button type='submit' onClick={() => navigate('/admin/productlist')}>Cancel</Button>
            </div>
    </Container>
  )
}
