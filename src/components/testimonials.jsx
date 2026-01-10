import { testimonials } from "../data";
function Testistonials() {
    return (
        <div className="container my-5">
      <h2 className="text-center mb-5">What Travelers Say</h2>
      <div className="row">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="text-warning mb-3">{testimonial.rating}</div>
                <p className="card-text fst-italic">"{testimonial.text}"</p>
                <h6 className="card-subtitle mt-3 text-muted">
                  - {testimonial.name}
                </h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );       
      }

export default Testistonials;