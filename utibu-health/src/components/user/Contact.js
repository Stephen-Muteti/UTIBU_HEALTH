import React from 'react';
import { Helmet } from 'react-helmet';

const Contact = () => {
    return (
        <>
        <Helmet>
            <title>Utibu-Health | Contact</title>
        </Helmet>
      <div id="container-fluid">        
        <section className="w3l-contact-main">
            <div className="contant11-top-bg py-5">
                <div className="container py-md-5">
                    <div className="row contact-info-left text-center">
                        <div className="col-lg-4 col-md-6 contact-info">
                            <div className="contact-gd">
                                <span className="fa fa-location-arrow" aria-hidden="true"></span>
                                <h4>Address</h4>
                                <p>123 Nairobi Road, Nairobi, Kenya</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 contact-info">
                            <div className="contact-gd">
                                <span className="fa fa-phone" aria-hidden="true"></span>
                                <h4>Phone</h4>
                                <p><a href="tel:+254 7570 90042">+254 7570 90042</a></p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 contact-info">
                            <div className="contact-gd">
                                <span className="fa fa-envelope-open-o" aria-hidden="true"></span>
                                <h4>Mail</h4>
                                <p><a to="#" className="email"><span className="__cf_email__" data-cfemail="523f333b3e12372a333f223e377c313d3f">info@utibu-health.com</span></a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="w3l-contact-main">
            <div className="contact-infhny py-5">
                <div className="container py-lg-5">
                    <div style={{ margin: '8px auto', display: 'block', textAlign: 'center' }}>
                    </div>
                    <div className="title-content text-left mb-lg-4 mt-3"
                    style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <h5 className="hny-title">Drop your message for any info <br />or question.</h5>
                    </div>
                    <div style={{ margin: '8px auto', display: 'block', textAlign: 'center' }}>
                    </div>
                    <div className="row align-form-map"
                    style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <div className="col-lg-4 form-inner-cont">
                            <form action="https://sendmail.w3layouts.com/submitForm" method="post" className="signin-form">
                                <div className="form-input">
                                    <label htmlFor="w3lName">Name*</label>
                                    <input type="text" name="w3lName" id="w3lName" placeholder="" />
                                </div>
                                <div className="form-input">
                                    <label htmlFor="w3lSender">Email*</label>
                                    <input type="email" name="w3lSender" id="w3lSender" placeholder="" required />
                                </div>
                                <div className="form-input">
                                    <label htmlFor="w3lMessage">Message*</label>
                                    <textarea placeholder="" name="w3lMessage" id="w3lMessage" required />
                                </div>
                                <button type="submit" className="btn btn-contact">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </div>
        </>
    );
}

export default Contact;
