import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MainFile() {
  const [displayData,setData] = useState([]);
  const [comment,setComment]=useState("");
  const [ind,setInd]=useState(-1)

  const fetchAllIssue = async () => {
   let response=await axios.get("http://localhost:2410/issues")
    console.log(response.data)
    setData(response.data)
  };

  useEffect(() => {
    fetchAllIssue();
  },[]);

  const changeStatus= async(key)=>{
    if(!comment){
        alert('enter comment first')
        return
    } 
    await axios.post('http://localhost:2410/changeStatus',{comment,key})
    setComment("")
    fetchAllIssue();

  }
  const handleComment=(e,index)=>{
    setInd(index)
    setComment(e.currentTarget.value)
  }
  return (
  <div className="container">
        <div className="row bg-dark text-white text-center">
            <div className="col-2">Number</div>
            <div className="col-2">Name</div>
            <div className="col-2">Description</div>
            <div className="col-1">Reporter</div>
            <div className="col-1">Status</div>
            <div className="col-2">Due Date</div>
            <div className="col-2"></div>
        </div>
        {displayData.map((ele,index)=>(
            <div className="row text-center border" style={{alignItems:'center'}}>
                <div className="col-2">
                    {ele.key} <img src={ele.fields.issuetype.iconUrl} alt="pic" />
                </div>
                <div className="col-2">{ele.fields.summary}</div>
                <div className="col-2">{ele.fields.description}</div>
                <div className="col-1">{ele.fields.reporter.displayName}</div>
                <div className="col-1">
                    {ele.fields.status.name}
                </div>
                <div className="col-2">{ele.fields.duedate ? ele.fields.duedate:"None" }</div>
                <div className="col-2">
                    {ele.fields.status.name!=='Done'? 
                    <>
                    <input type='text' style={{width:'75%',borderRadius:'4px',paddingBottom:'4px'}} value={ind==index ? comment:""} onChange={(e)=>handleComment(e,index)} placeholder="add comment*"/>
                     <button className="btn btn-success btn-sm" onClick={()=>changeStatus(ele.key)}>✓</button>
                    </>
                     :"" }
                </div>
            </div>
        ))}
        <button className="btn btn-info m-2" onClick={fetchAllIssue}>Fetch Data</button>
  </div>)
}
