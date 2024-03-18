

export const profile=async (req,res)=>{
    try {
        console.log("signup section");
        
    } catch (error) {
        console.error("Error from signup",error)
        return res.status(500).json({message:"Internal server error"})
    }
   
}
