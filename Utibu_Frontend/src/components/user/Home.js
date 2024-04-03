import SimpleBar from 'simplebar-react';
import { Helmet } from 'react-helmet';
import abImage from './images/ab.jpg';
import {NavLink, Outlet} from 'react-router-dom';
import Header from '../Header.js';

const Home = () => {
	return(
		<>
		    <Helmet>
		      <title>Utibu-Health | Home</title>
		    </Helmet>
		    <div className="main-content user-main-container" style={{ marginLeft: '0px' }}>
		      {/*<SimpleBar className="page-content page-container-scroll">*/}
		             <div className="container-fluid" style={{paddingLeft:'0px',paddingRight:'0px'}}>
						<div className="row" style={{marginLeft:'0px',marginRight:'0px'}}>
			                <div className="">
			                    
			                </div>
			            <div className="row" style={{marginLeft:'0px',marginRight:'0px'}}>

			            <section className="w3l-main-slider" id="home">
						            <div className="banner-content">
						                <div className="owl-one owl-carousel owl-theme" style={{display:'block'}}>
						                    <div className="item">
						                        <div className="slider-info banner-view bg bg2">
						                            <div className="banner-info">
						                                <div className="container">
						                                    <div className="banner-info-bg">
						                                        <h6>Health care for life</h6>
						                                        <h5>Experience, trust and proven success</h5>
						                                        <NavLink className="btn mt-sm-5 mt-4" to="medications">View Available Medications</NavLink>
						                                    </div>
						                                </div>
						                            </div>
						                        </div>
						                    </div>
						                </div>
						                <ul className="slide-social-icons list-unstyled">
						                    <li className="share">Catch on Social : </li>
						                    <li>
						                        <a className="w3pvt_facebook">
						                            <span className="fa fa-facebook-f"></span>
						                        </a>
						                    </li>
						                    <li>
						                        <a className="w3pvt_twitter">
						                            <span className="fa fa-twitter"></span>
						                        </a>
						                    </li>
						                    <li>
						                        <a className="w3pvt_google">
						                            <span className="fa fa-google-plus"></span>
						                        </a>
						                    </li>
						                </ul>
						            </div>
						        </section>	

						        <section className="w3l-free-consultion">
						            <div className="container">
						                <div className="consultation-grids">
						                    <div className="apply-form">
						                        <h5>Free Consultation</h5>
						                        <form>
						                            <div className="admission-form">
						                                <div className="form-group">
						                                    <input type="text" className="form-control" placeholder="Full Name*" required />
						                                </div>
						                                <div className="form-group">
						                                    <input type="text" className="form-control" placeholder="Phone Number*" required />
						                                </div>
						                                <div className="form-group">
						                                    <input type="email" className="form-control" placeholder="Email*" required />
						                                </div>
						                            </div>
						                            <div className="form-group">
						                                <textarea name="Comment" className="form-control" placeholder="Message*" required></textarea>
						                            </div>
						                            <button type="submit" className="btn btn-primary submit">Get a Free Consultation</button>
						                        </form>
						                    </div>
						                    <div className="consultation-img">
						                        <img src={abImage} className="img-fluid" alt="/" />
						                    </div>
						                </div>
						            </div>
						        </section>                
			            	</div>
			            </div>
			        </div>
		      {/*</SimpleBar>*/}
		    </div>
	    </>
		)
}

export default Home;