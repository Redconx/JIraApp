var axios = require("axios");
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

const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  password: "Ajay1#vinay",
  database: "postgres",
  port: 5432,
  host: "db.bvkchvpqwcbvyebrefej.supabase.co",
});
client.connect(function (res, error) {
  console.log("connected !!!");
});
const URL1 = "https://ajayjiraapp.atlassian.net/rest/api/2/search";

pushDataToDb();

async function pushDataToDb() {
  try {
    let response = await axios.get(URL1, {
      headers: {
        Authorization:
          "Basic YWpuYXVnYWluOTA3QGdtYWlsLmNvbTpBVEFUVDN4RmZHRjBEUHBEUkFEdFZSdWVNWlN1VFAxUlRFbjJVb3R6VGk1eF9Bb1c2UUZVQW5SbDhrR3BLdDhwOU5nUzYtME9uT2t6R1hFVnltXzNIcFRzdE9VTklJdWtpdGppVDlkS3M1TTMyeUdnVmM1NXQxTU9FMU44VzhLOEhINkhVcm9TcUdqMTNCQU00TTNjNFFUdjZrX0dHalVoT3NUNmJjcFRJT2R5dk5RZklOR2xIY1k9QzQ2MEQ4RTM",
      },
    });
    let dataForDb = response.data.issues.map((ele) => ({
      number: ele.key,
      name: ele.fields.summary,
      description: ele.fields.description,
      reporter: ele.fields.reporter.displayName,
      status: ele.fields.status.name,
      duedate: ele.fields.duedate,
    }));

    let sql = "truncate table issues";
    client.query(sql, function (err, result) {
      if (err) console.log(err);
      else {
        console.log("table emptied success");
        resetData();
      }
    });

    resetData = () => {
      let issueArray = dataForDb.map((ele) => [
        ele.number,
        ele.name,
        ele.description,
        ele.reporter,
        ele.status,
        ele.duedate,
      ]);
      // console.log(issueArray);
      issueArray.map((ele) => {
        // console.log(ele);
        let sql1 = "INSERT INTO issues VALUES ($1,$2,$3,$4,$5,$6)";
        client.query(sql1, ele, function (err, result) {});
      });
    };
  } catch (error) {
    console.log(error.message, "error");
  }
}

const paginate = (items, page , perPage ) => {
    const offset = perPage * (page - 1);
    const totalPages = Math.ceil(items.length / perPage);
    const paginatedItems = items.slice(offset, perPage * page);
  
    return {
        previousPage: page - 1 ? page - 1 : null,
        nextPage: (totalPages > page) ? page + 1 : null,
        total: items.length,
        totalPages: totalPages,
        items: paginatedItems
    };
  };



app.get("/issues", async function (req, res) {
  
  const { page = 1, limit = 4 } = req.query;
  console.log(page)
  try {
    let response = await axios.get(URL1, {
      headers: {
        Authorization:
          "Basic YWpuYXVnYWluOTA3QGdtYWlsLmNvbTpBVEFUVDN4RmZHRjBEUHBEUkFEdFZSdWVNWlN1VFAxUlRFbjJVb3R6VGk1eF9Bb1c2UUZVQW5SbDhrR3BLdDhwOU5nUzYtME9uT2t6R1hFVnltXzNIcFRzdE9VTklJdWtpdGppVDlkS3M1TTMyeUdnVmM1NXQxTU9FMU44VzhLOEhINkhVcm9TcUdqMTNCQU00TTNjNFFUdjZrX0dHalVoT3NUNmJjcFRJT2R5dk5RZklOR2xIY1k9QzQ2MEQ4RTM",
      },
    });
    pushDataToDb();
    const issueArr=paginate(response.data.issues,+page,+limit)
    res.send(issueArr);
  } catch (error) {
    console.log(error.message, "error");
  }
});

app.post("/changeStatus", async function (req, res) {
  const { comment, key } = req.body;
  console.log(req.body);
  console.log(comment, key);
  const obj1 = { transition: { id: "31" } };
  const obj2 = { body: comment };
  try {
    let resp1 = await axios.post(
      `https://ajayjiraapp.atlassian.net/rest/api/3/issue/${key}/transitions`,
      obj1,
      {
        headers: {
          Authorization:
            "Basic YWpuYXVnYWluOTA3QGdtYWlsLmNvbTpBVEFUVDN4RmZHRjBEUHBEUkFEdFZSdWVNWlN1VFAxUlRFbjJVb3R6VGk1eF9Bb1c2UUZVQW5SbDhrR3BLdDhwOU5nUzYtME9uT2t6R1hFVnltXzNIcFRzdE9VTklJdWtpdGppVDlkS3M1TTMyeUdnVmM1NXQxTU9FMU44VzhLOEhINkhVcm9TcUdqMTNCQU00TTNjNFFUdjZrX0dHalVoT3NUNmJjcFRJT2R5dk5RZklOR2xIY1k9QzQ2MEQ4RTM",
        },
      }
    );
    let resp2 = await axios.post(
      `https://ajayjiraapp.atlassian.net/rest/api/2/issue/${key}/comment`,
      obj2,
      {
        headers: {
          Authorization:
            "Basic YWpuYXVnYWluOTA3QGdtYWlsLmNvbTpBVEFUVDN4RmZHRjBEUHBEUkFEdFZSdWVNWlN1VFAxUlRFbjJVb3R6VGk1eF9Bb1c2UUZVQW5SbDhrR3BLdDhwOU5nUzYtME9uT2t6R1hFVnltXzNIcFRzdE9VTklJdWtpdGppVDlkS3M1TTMyeUdnVmM1NXQxTU9FMU44VzhLOEhINkhVcm9TcUdqMTNCQU00TTNjNFFUdjZrX0dHalVoT3NUNmJjcFRJT2R5dk5RZklOR2xIY1k9QzQ2MEQ4RTM",
        },
      }
    );
    res.send("status changed succesfully");
  } catch (error) {
    console.log(error.message, "error");
    res.send(error.message);
  }
});
