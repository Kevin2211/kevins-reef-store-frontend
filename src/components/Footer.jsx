import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {

    const footerStyle = {
        backgroundColor: '#d7d8ea'
    }
    const divStyle = {
        backgroundColor: '#373e98'
    }
    const linkStyle ={

    }
    const logoStyle ={
        width: '125px'
    }
  return (
        <footer
                className="footer text-center text-lg-start text-dark mt-3"
                style={footerStyle}
                >

          <div className="container p-4 pb-0">

            <section className="">

              <div className="row">

                <div className="col-sm-12 col-md-6 col-lg-3 mb-2 mt-3">
                  
                  <h6 className="text-uppercase mb-2 store font-weight-bold">
                  <img src="/images/kevinsreeflogo.png" className='logo' alt="" />
                    Kevin's Reef Store
                  </h6>
                  <i className='text-muted text-italic'>
                  Experience the beauty of eco-friendly aqua-cultured corals in your home aquarium
                  </i>
                </div>


                <hr className="w-100 clearfix d-md-none" />


                <div className="col-6 col-sm-6 col-md-4 col-lg-2 mt-3">
                  <h6 className="text-uppercase mb-3 font-weight-bold">Help</h6>
                  <p>
                    <Link className="text-dark">DOA policy</Link>
                  </p>
                  <p>
                    <Link className="text-dark">Shipping</ Link>
                  </p>

                </div>


                <div className="col-6 col-sm-6 col-md-4 col-lg-2 mt-3">
                  <h6 className="text-uppercase mb-2 font-weight-bold">Featured on</h6>
                  <a
                  target="_blank" rel="noopener noreferrer"
                    style={linkStyle}
                    href="https://reefbuilders.com/2020/08/25/kevins-reef-tank-is-an-lps-masterpiece/"
                    >
                  <img className='mb-2' src="https://reefbuilders.com/wp-content/blogs.dir/1/files/2016/07/RB_Logo-2.png" style={logoStyle} alt="reefbuilder" />
                    </a>
                    <a
                  target="_blank" rel="noopener noreferrer"
                    style={linkStyle}
                    href="https://www.reef2reef.com/"
                    >
                  <img src="https://www.reef2reef.com/attachments/clown-colors-full-1-png.809313/" style={logoStyle} alt="reef2reef" />
                    </a>


                </div>

                <hr className="w-100 clearfix d-md-none" />

                <div className="col-6 col-sm-6 col-md-2 col-lg-2 mt-3">
                  <h6 className="text-uppercase mb-3 font-weight-bold">Secure Payment</h6>
                  <img src="/images/paypal.png" style={logoStyle} alt="paypal" />

                </div>



                <div className=" col-6 col-sm-6 col-md-4 col-lg-2 mt-3">
                  <h6 className="text-uppercase mb-1 font-weight-bold">Follow or DM US</h6>
                  <a
                  target="_blank" rel="noopener noreferrer"
                    className="btn btn-floating m-1"
                    style={linkStyle}

                    href="https://www.instagram.com/yaboikevin42/"
                    role="button"
                    ><i className="fab fa-instagram fa-2x"></i></a>
                </div>
              </div>

            </section>

          </div>


          <div
              className="text-center text-white p-3"
              style={divStyle}
              >
            Built and Designed by Kevin with <i className="fas fa-heart me-1"></i> © 2023 Copyright

          </div>

        </footer>


  )
}
