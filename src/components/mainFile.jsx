import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MainFile() {
  const [displayData,setData] = useState([]);
  const [comment,setComment]=useState("");
  const [ind,setInd]=useState(-1)
  const [prevPage,setPrevPage]=useState('')
  const [nextPage,setNextPage]=useState('')
  const [total,setTotal]=useState('')
  const navigate = useNavigate();

  const fetchAllIssue = async (searchstr ='') => {
   let response=await axios.get(`http://localhost:2410/issues?${searchstr}`)
    console.log(response.data)
    setData(response.data.items)
    setPrevPage(response.data.previousPage)
    setNextPage(response.data.nextPage)
    setTotal(response.data.totalPages)
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
    let searchStr = makeSearchString({page:prevPage+1||nextPage-1});
    fetchAllIssue(searchStr);
  }


  const handleComment=(e,index)=>{
    setInd(index)
    setComment(e.currentTarget.value)
  }

  const reFetchIssue=()=>{
    callURL(`/`,{page:'1'})
  }

  const onChange=(options)=>{
    callURL(`/`,options);
  }
const callURL = (url, options) => {
    let searchStr = makeSearchString(options);
    fetchAllIssue(searchStr)
    navigate({ pathname: url, search: searchStr });
  };
const makeSearchString = (options) => {
    let { page } = options;
    let searchString = "";
    searchString = addToQueryString(searchString, "page", page);
    return searchString;
  };
  const addToQueryString = (str, paramName, paramValue) =>
  paramValue
    ? str
      ? `${str}&${paramName}=${paramValue}`
      : `${paramName}=${paramValue}`
    : str;



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


<div className="row">
  <div className="col-2">{prevPage && <button className="btn btn-success btn-sm m-3" onClick={()=>onChange({page:prevPage})}>Prev</button>}</div>
  <div className="col-8 text-center pt-3" style={{fontSize:'14px'}}>
  Page {prevPage+1||nextPage-1} of {total}
  </div>
  <div className="col-2">{nextPage && <button className="btn btn-success btn-sm m-3" onClick={()=>onChange({page:nextPage})}>Next</button>}</div>
</div>

<button className="btn btn-info m-2" onClick={reFetchIssue}>Fetch Data</button>
  </div>)
}
