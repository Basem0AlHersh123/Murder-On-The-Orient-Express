// 📁 src/components/About.jsx
import React from 'react';
function About() {
  return (
    <div className="container my-5">
        <main className="row align-items-center">
            <section className="col-md-6">
                <h2>About TravelExplorer</h2>
                <ul className="list-unstyled mt-4">
                    <li className="mb-3">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        curated travel experiences local experts</li>
                <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    best price guarantee</li>
                <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-success me-2 "></i>
                    24/7 customer support</li>
                <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    easy booking process</li>
                </ul>
            </section>
            <section className="col-md-6">
                <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828" alt="Travel Group" className="img-fluid rounded w-100" style={{height:"300px", objectFit:"cover"}}/>
            </section>
        </main>
    </div>
  );
  
}

export default About;