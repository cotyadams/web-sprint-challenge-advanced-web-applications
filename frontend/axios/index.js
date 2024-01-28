// ✨ implement axiosWithAuth
import axios from "axios";
const axiosWithAuth = () => {
    const token = localStorage.getItem('token')
    return (
        axiosWithAuth.create({
            headers: {authorization: token}
        })
    )
}
export default axiosWithAuth;
    
