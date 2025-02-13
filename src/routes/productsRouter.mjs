import { Router } from "express";

const router = Router();


const products = [
    {id : 1, name : "Chiken breast", price : 12.99},
    {id : 2, name : "Chiken full", price : 10.99},
    {id : 3, name : "Chips got", price : 4.99},
    {id : 4, name : "Chips beef", price : 3.99},
    {id : 5, name : "Plantain breast", price : 14.99}
]

router.get('/api/products', (req, res) => {
    console.log(req.headers.cookie);
    console.log(req.cookies);
    console.log(req.signedCookies);
    if(req.cookies.hello && req.cookies.hello === "world")
        return  res.status(200).send(products)
    return res.status(403).send({msg : "Sorry. You need a correct cookie"});
   
})

export default router;