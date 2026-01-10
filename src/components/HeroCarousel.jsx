import Image1 from "../../public/images/1.jpg"
import Image2 from "../../public/images/2.jpg"
import Image3 from "../../public/images/3.webp"
import Image4 from "../../public/images/4.jpg"
document.cookie="username=Hammood; theme=dark;path=/cookies";
console.log(document.cookie);
function HeroCarousel(){
    const images=[Image1,Image2,Image3,Image4];
    return (
        <div className="carousel slide container w-75 my-4 shadow "data-bs-ride='carousel' id="slide">
            <div className="carousel-indicators">
            {
                [0,1,2,3].map((i)=>(
                    <button type='button' data-bs-target='#slide' data-bs-slide-to={i} aria-current='true' className={i===0?"active":""} aria-label={"slide "+(i+1)}></button>
                ))    
            }
            </div>
            <div className="carousel-inner rounded  ">
            {
                images.map((image, index)=>(
                <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                    <img src={image} alt="" className="w-100 d-block"/>
                    <div className="carousel-caption d-none d-md-block">
                    </div>
                </div>
                ))
            }
        </div>
            <button className="carousel-control-prev" type="button" data-bs-target='#slide' data-bs-slide='prev'>
                <span className="carousel-control-prev-icon" aria-hidden='true'></span>
                <span className="visually-hidden" aria-hidden='true'>Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target='#slide' data-bs-slide='next'>
                <span className="carousel-control-next-icon" aria-hidden='true'></span>
                <span className="visually-hidden" aria-hidden='true'>Next</span>
            </button>
        </div>
        //add category right here
    );
}

export default HeroCarousel;












/*
mport { products } from "./data"

const Home = () => {
  return (
    <>
      <div id="carouselExample" class="carousel slide mt-5">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="/images/bag.jpg" class="d-block w-100 slider-img" alt="..." />
          </div>
          <div class="carousel-item">
            <img src="/images/necklace.jpg" class="d-block w-100 slider-img" alt="..." />
          </div>
          <div class="carousel-item">
            <img src="/images/watch.jpg" class="d-block w-100 slider-img" alt="..." />
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>

      <div className="container">
        <h1 className="mt-4 mb-4 text-center">Products</h1>
        <div className="row products mt-5 g-5">
          {
            products.map((product)=>(
              <div className="col-lg-4 col-sm-6 col-12">
            <img src={product.img} alt="" />
            <h2 className="mt-3 mb-3">{product.title}</h2>
            <p>Price : {product.price}</p>
            <button className="btn btn-warning">Buy Now</button>
          </div>
            ))
          }
         
        </div>
      </div>
    </>
  )
}

export default Home


*/ 

