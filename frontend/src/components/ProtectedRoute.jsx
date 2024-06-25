import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect } from "react"


function ProtectedRoute({children}){
    const [isAuthorized, setIsAusthorized] = useState(null)

    useEffect(()=>{
        auth().catch(()=> setIsAusthorized(false))
    })


    const refreshToken = async () =>{
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)

            try{ const res = await api.post("/api/token/refresh/",{refresh: refreshToken});
                if (res.status === 200){
                    localStorage.setItem(ACCESS_TOKEN,res.data.access)
                    setIsAusthorized(true)

                }else{
                    setIsAusthorized(false)
                }  
            
            }catch(error){
                console.log(error)
                setIsAusthorized(false)
            }
        
    }
    const auth = async () =>{
        const token = localStorage.getItem(ACCESS_TOKEN)
        if(!token){
            setIsAusthorized(false)
            return
        }    
    const decoded = jwtDecode(token)
    const tokenExpiriation = decoded.exp
    const now  = Date.now()/1000

    if (tokenExpiriation < now){
        await refreshToken()

    }
    else{
        setIsAusthorized(true)
    }
     
    
    }


    if(isAuthorized === null){

        return <div>Loading...</div>
    }

return isAuthorized ? children : <Navigate to = "/login"/>

}

export default ProtectedRoute;
