import React from 'react'

const CityHero = (city) => {
  return (
    <div>


<div class="container col-xxl-8 px-4 py-5">
    <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
      <div class="col-10 col-sm-8 col-lg-6">
        <img src={city.image} class="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" width="700" height="500" loading="lazy"/>
      </div>
      <div class="col-lg-6">
        <h1 class="display-5 fw-bold lh-1 mb-3">{city.name}</h1>
        <p class="lead">{city.discription}</p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-start">
          
        </div>
      </div>
    </div>
  </div>



    </div>
  )
}

export default CityHero