import profile_image from "./assets/profile.png"
function card(){
    return (
        
            <div className="card bg-dark text-center p-4">
                <img src={profile_image} alt="Main image" className="card-image" />
                <h2 className="title">Basem Al-Hersh</h2>
                <p>Cyber security</p>
            </div>
            
    );
}
export default card