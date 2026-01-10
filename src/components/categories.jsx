import { images } from "../data";
function Categories() {
  return (
    <div className="container mt-5 ">
      <h4 className="text-center p-4"> Popular Destinations </h4>
        <div className="flex row justify-content-center">
            {images.map((image) => (
      <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={image.id} style={{width: "18rem"}}>
          <div className="card h-100 shadow-sm">
            <img src={image.src}  className="card-img-top" alt={image.title} />
            <div className="card-body">
              <h5 className="card-title">{image.title}</h5>
              <p className="card-text">{image.description}</p>
            </div>
          </div>
        </div>
        ))}
        </div>
    </div>
  );
}

export default Categories;
