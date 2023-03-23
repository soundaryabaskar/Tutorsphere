import { useState } from "react"
import { useNavigate } from "react-router-dom";
import useFirestore from "../../firestore";
import { useAuthContext } from "../context/UserAuthContext";

export default function SignUp(){

    const {user, registerUser, updateUserRole} = useAuthContext();
    const {addUserToCollection} = useFirestore();
    const navigate = useNavigate();
    
    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        username: "",
        userRole: "students"
    });

    const [authInfo, setAuthInfo] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleUserSelectionChange = (e) => {
        const {name, value} = e.target;
        setUserInfo(userInfo => {
            return {...userInfo, [name]: value}
        })
    };

    const handleAuthChange = (e) => {
        const {name, value} = e.target;
        setAuthInfo({...authInfo, [name]: value});
    };

    console.log("ERROR IS", error)


    console.log("user outside is", user);
    // TODO: make sure all values are filled and clean/trim before validating and submitting
    const handleSubmit = async () => {
        // create new user
        try{
            // TODO: decide whether response is needed or not
            const response = await registerUser(authInfo.email, authInfo.password);
            // const userId = response?.user?.uid;
            // console.log("userId is", userId);

            try{
                const userInfoToAdd = {
                    ...userInfo,
                    isProfileSetup: false
                };
                console.log("USER IN SIGN UP IS", response?.user)
                if(response?.user){
                    const addResult = await addUserToCollection(response.user.uid, userInfoToAdd);
                    console.log("addresult", addResult);
                    navigate("/appointments");
                }
                setError("Error registering. Please contact the administrator")
            }catch(err){
                setError(err.message);
            }

        }catch(err){
            setError(err.message);
        }
    };

    return (
        <div>
            <div>
            <div className="mask d-flex align-items-center h-100 gradient-custom-3">
            <div className="container h-100 max-height-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                    <div className="card max-height-100" style={{borderRadius: "15px"}}>
                    <div className="card-body p-4 max-height-100" >
                        <h2 className="text-center mb-5">Register as a User</h2>
        
                        <form onSubmit={handleSubmit}>
        
                        <div className="form-outline mb-4">
                            <label className="form-label">First Name</label>
                            <input required name="firstName" type="text" className="form-control form-control-lg" value={userInfo.firstName} onChange={handleUserSelectionChange}/>
                        </div>
                        <div className="form-outline mb-4">
                            <label className="form-label">Last Name</label>
                            <input required name="lastName" type="text" className="form-control form-control-lg" value={userInfo.lastName} onChange={handleUserSelectionChange} />
                        </div>
                        <div className="form-outline mb-4">
                            <label className="form-label">Username</label>
                            <input required name="username" type="text" className="form-control form-control-lg" value={userInfo.username} onChange={handleUserSelectionChange}/>
                        </div>
                        <div className="form-outline mb-4">
                            <label className="form-label">Student or Tutor? </label>
                            <select name="userRole" value={userInfo.userRole} onChange={handleUserSelectionChange} className="form-control form-control-lg">
                                <option value="students">Student</option>
                                <option value="tutors">Tutor</option>
                            </select>
                        </div>
                        <div className="form-outline mb-4">
                            <label className="form-label">Email address</label>
                            <input required name="email" type="email" className="form-control form-control-lg" value={authInfo.email} onChange={handleAuthChange}/>
                        </div>
                        <div className="form-outline mb-4">
                            <label className="form-label">Password</label>
                            <input required name="password" type="password" className="form-control form-control-lg" value={authInfo.password} onChange={handleAuthChange}/>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="button" onClick={handleSubmit}
                            className="btn btn-success btn-block btn-lg gradient-custom-4 text-body">Register</button>
                        </div>
                        <p className="text-center text-muted mt-5 mb-0">Already have an account? <a onClick={() => navigate("/signin")} style={{cursor: "pointer"}}
                            className="fw-bold text-body"><u>Login here</u></a></p>
                        </form>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        <p>hello</p>
        <div>hi</div>
        {error}
        </div>
    )
}