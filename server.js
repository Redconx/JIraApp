var axios=require('axios')
var express = require("express");
var app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
    res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  next();
});
const port = 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));


const URL1='https://ajayjiraapp.atlassian.net/rest/api/2/search'

app.get("/issues", async function(req,res){
    console.log("hi");
    try {
        let response = await axios.get( URL1 , {headers:{Authorization:'Basic YWpuYXVnYWluOTA3QGdtYWlsLmNvbTpBVEFUVDN4RmZHRjBEUHBEUkFEdFZSdWVNWlN1VFAxUlRFbjJVb3R6VGk1eF9Bb1c2UUZVQW5SbDhrR3BLdDhwOU5nUzYtME9uT2t6R1hFVnltXzNIcFRzdE9VTklJdWtpdGppVDlkS3M1TTMyeUdnVmM1NXQxTU9FMU44VzhLOEhINkhVcm9TcUdqMTNCQU00TTNjNFFUdjZrX0dHalVoT3NUNmJjcFRJT2R5dk5RZklOR2xIY1k9QzQ2MEQ4RTM'}})
        res.send(response.data.issues)
    } catch (error) {
        console.log(error.message,'error')   
    }
})

app.post("/changeStatus",async function(req,res){
    const {comment,key}=req.body
    console.log(req.body)
    console.log(comment,key)
    const obj1={transition: {id: "31"}}
    const obj2={body:comment}
    try {
        let resp1= await axios.post(`https://ajayjiraapp.atlassian.net/rest/api/3/issue/${key}/transitions`,obj1,{headers:{Authorization:'Basic YWpuYXVnYWluOTA3QGdtYWlsLmNvbTpBVEFUVDN4RmZHRjBEUHBEUkFEdFZSdWVNWlN1VFAxUlRFbjJVb3R6VGk1eF9Bb1c2UUZVQW5SbDhrR3BLdDhwOU5nUzYtME9uT2t6R1hFVnltXzNIcFRzdE9VTklJdWtpdGppVDlkS3M1TTMyeUdnVmM1NXQxTU9FMU44VzhLOEhINkhVcm9TcUdqMTNCQU00TTNjNFFUdjZrX0dHalVoT3NUNmJjcFRJT2R5dk5RZklOR2xIY1k9QzQ2MEQ4RTM'}})
        let resp2= await axios.post(`https://ajayjiraapp.atlassian.net/rest/api/2/issue/${key}/comment`,obj2,{headers:{Authorization:'Basic YWpuYXVnYWluOTA3QGdtYWlsLmNvbTpBVEFUVDN4RmZHRjBEUHBEUkFEdFZSdWVNWlN1VFAxUlRFbjJVb3R6VGk1eF9Bb1c2UUZVQW5SbDhrR3BLdDhwOU5nUzYtME9uT2t6R1hFVnltXzNIcFRzdE9VTklJdWtpdGppVDlkS3M1TTMyeUdnVmM1NXQxTU9FMU44VzhLOEhINkhVcm9TcUdqMTNCQU00TTNjNFFUdjZrX0dHalVoT3NUNmJjcFRJT2R5dk5RZklOR2xIY1k9QzQ2MEQ4RTM'}})
        res.send('status changed succesfully')
    } catch (error) {
        console.log(error.message,'error')
        res.send(error.message)
    }
    
})