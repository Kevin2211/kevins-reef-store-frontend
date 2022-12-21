
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import {Navbar, Container, Nav, Badge, NavDropdown, Button} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { useContext } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import Footer from './components/Footer';
import { useState } from 'react';
import { useEffect } from 'react';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import NewProductScreen from './screens/NewProductScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import EditProductScreen from './screens/EditProductScreen';
import CustomerSupportScreen from './screens/CustomerSupportScreen';
import ChatBox from './components/ChatBox';

function App() {
  const { state, dispatch: contextDispatch } = useContext(Store)
  const { cart, userInfo } = state

  const signoutHandler = () => {
    contextDispatch({ type: 'USER-SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    window.location.href = '/'
    
  }
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
     try {
      const { data } = await axios.get(`/api/products/categories`)
      setCategories(data)

     } catch (error) {
      toast.error(getError(error))
     } 
    }
    fetchCategories()
  },[])
  return (
    <div className='d-flex flex-column min-vh-100 position-relative page-container'>
      <BrowserRouter>
      <div className={ isSideBarOpen 
        ? 'd-flex flex-column ' 
        : "d-flex flex-column "
        }>
        <ToastContainer position='bottom-center' limit={1}/>

        <Navbar bg="secondary" variant="dark" expand="lg" className='shadow-lg sticky-top'>
          <Container>
            <Button variant='secondary' className='me-3'
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
              <i className='fas fa-bars'></i>
            </Button>
            <LinkContainer to="/">
              <Navbar.Brand className='store d-flex align-items-center'>
                <img src="/images/kevinsreeflogo.png" className='logo' alt="" />
                 <div className='d-none d-md-block'>Kevin's Reef Store</div>
                </Navbar.Brand>
            </LinkContainer>
            <Link to='/cart' className='nav-link d-md-none ms-auto me-3 '>
            <i className="fa fa-shopping-cart "></i> 
                { cart.cartItems.length > 0 && (
                  <Badge pill className='mx-1' bg="danger">
                    {cart.cartItems.reduce( (a,b) => a + b.quantity, 0)}
                  </Badge>
                )
              }
              </Link>
            <Navbar.Toggle aria-controls='basic-navbar-nav'></Navbar.Toggle>
            <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto w-100 justify-content-end'>
              <div className='me-2'>
                <SearchBox></SearchBox>
              </div>

            <Link to='/cart' className='nav-link d-none d-md-block '>
              <div className='d-flex'>
                <i className="fa fa-shopping-cart mt-1"></i> 
                <div className=''>
                  { cart.cartItems.length > 0 && (
                    <Badge pill className='mx-1' bg="danger">
                      {cart.cartItems.reduce( (a,b) => a + b.quantity, 0)}
                    </Badge>
                  ) 
                }
                </div>
              </div>
            </Link>


              {userInfo ? (
                <NavDropdown title={userInfo.name} id="nav-dropdown">
                    <LinkContainer to='/myprofile'>
                      <NavDropdown.Item> User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/myorders'>
                      <NavDropdown.Item>My Orders</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider></NavDropdown.Divider>
                    <Link to='#signout' className='dropdown-item' onClick={signoutHandler}>Sign Out</Link>
                </NavDropdown>
              ):( <>
              
                <Link className="nav-link" to='/signup'> Register</Link>
                <Link className="nav-link" to='/signin'> Sign in</Link>
              </>
              )}
              { userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="admin-nav-dropdown">
                    <LinkContainer to='/admin/dashboard'>
                      <NavDropdown.Item>Dashboard</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/productlist'>
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/orderlist'>
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/userlist'>
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/support'>
                      <NavDropdown.Item>Customer Support</NavDropdown.Item>
                    </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Navbar bg="warning" variant="dark" expand="lg" >
              <Container className='d-flex justify-content-center my-0' >
                <p className=' my-0' >Free Overnight Shipping on Orders +$300</p>
              </Container>
        </Navbar>
      
        
        <div className={isSideBarOpen 
        ? 'active-cont side-navbar d-flex justify-content-between flex-wrap flex-column'
        : 'side-navbar d-flex  justify-content-between flex-wrap flex-column'}>
          <Nav className='flex-column text-white w-100 p-2'>
          <div className='d-flex justify-content-end '>
            <Button variant='secondary' className='me-2 mb-2'
                onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
                  <i className='fas fa-caret-left'></i>
            </Button>
          </div>
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            <Nav.Item> 
                <LinkContainer to={
                  {
                    pathname: "/search",
                    search: ``
                  }
                } 
                onClick={() => setIsSideBarOpen(false)}>
                  <Nav.Link>All Corals</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}> 
                <LinkContainer to={
                  {
                    pathname: "/search",
                    search: `?category=${category}`
                  }
                } 
                onClick={() => setIsSideBarOpen(false)}>
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main >
          <Container className='mt-4'>
            <Routes>
              <Route path='/product/:slug' element={ <ProductScreen/> }/>
              <Route path='/order/:id' element={ 
                <ProtectedRoute>
                  <OrderScreen/>
                </ProtectedRoute>
                }/>
              <Route path='/search' element={ <SearchScreen/> }/>
              <Route path='/cart' element={ <CartScreen/> }/>
              <Route path='/signin' element={ <SigninScreen/> }/>
              <Route path='/signup' element={ <SignupScreen/> }/>
              <Route path='/myprofile' element={ 
                <ProtectedRoute>
                  <ProfileScreen/> 
                </ProtectedRoute>
              }/>
              <Route path='/shipping' element={ <ShippingAddressScreen />}></Route>
              <Route path='/payment' element={ <PaymentScreen/> }/>
              <Route path='/placeorder' element={ <PlaceOrderScreen/> }/>
              <Route path='/myorders' element={ 
                <ProtectedRoute>
                  <OrderHistoryScreen/>
                </ProtectedRoute>
               }/>
               
               {/* Admin Routes */}
               <Route path='/admin/dashboard'
               element={ <AdminRoute><DashboardScreen /></AdminRoute> }
               ></Route>
                <Route path='/admin/support'
               element={ <AdminRoute><CustomerSupportScreen /></AdminRoute> }
               ></Route>
                <Route path='/admin/productlist'
               element={ <AdminRoute><ProductListScreen /></AdminRoute> }
               ></Route>
                <Route path='/admin/newproduct'
               element={ <AdminRoute><NewProductScreen /></AdminRoute> }
               ></Route>
                <Route path='/admin/:id/edit'
               element={ <AdminRoute><EditProductScreen /></AdminRoute> }
               ></Route>

              <Route path="/" element={ <HomeScreen/> } />
            </Routes>
          </Container>

        </main>

        <Footer className='footer' />
        <ChatBox userInfo={userInfo} />
        </div>
        </BrowserRouter>
    </div>

  );
}

export default App;
