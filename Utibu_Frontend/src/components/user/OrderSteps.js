const OrderSteps = () =>{
	return(
		<section className="w3l-content-with-photo-4 col-xl-12">
		    <div className="">
		      <div className="container">
		        <div style={{ margin: "8px auto", display: "block", textAlign: "center" }}>
		        </div>
		        <div className="row">
		          <div className="col-xl-6">
		            <h6 className="sub-title">Order Placement Steps</h6>
		            <h3 className="hny-title">Order Steps</h3>
		            <div className="servehny-1" style={{display:'flex'}}>
		              <div className="ser-sub col-xl-12">
		                <a className="ser1"><span className="fa fa-check"></span> Login First</a>
		                <a className="ser1"><span className="fa fa-check"></span> Navigate to medications tab</a>
		                <a className="ser1"><span className="fa fa-check"></span> Pick the ID of the medication you want to order</a>
		                <a className="ser1"><span className="fa fa-check"></span> Fill the order table</a>
		              </div>
		            </div>
		          </div>
		          <div className="col-xl-6">
		            <h3 className="hny-title">Note the Following</h3>
		            <div className="servehny-1" style={{display:'flex'}}>
		              <div className="ser-sub col-xl-12" 
		              style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
		                <a style={{fontSize: '16px',lineHeight: '30px'}}><span className="fa fa-check"></span> If the medication ID is not correct the order will not be possible</a>
		                <a style={{fontSize: '16px',lineHeight: '30px'}}><span className="fa fa-check"></span> The quantity unit you enter should be convertible to the unit of the medication price</a>
		                <a style={{fontSize: '16px',lineHeight: '30px'}}><span className="fa fa-check"></span> If the odrer placement is succeeful you will be redirected to the chackout page</a>
		                <a style={{fontSize: '16px',lineHeight: '30px'}}><span className="fa fa-check"></span> You can chose to pay later after delivery of the order by navigating from the checkout page</a>
		              </div>
		            </div>
		          </div>
		        </div>
		      </div>
		    </div>
		  </section>
		);
}

export default OrderSteps;