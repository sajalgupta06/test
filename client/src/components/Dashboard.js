import React, { useEffect, useState } from "react";
import cookie from "js-cookie";
export default function Dashboard() {
  const [date, setDate] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [reminder, setReminder] = useState([]);
  const [recurrent,setRecurrent] = useState("");

  useEffect(() => {
    var local_reminder = localStorage.getItem("reminder");
    if (local_reminder == null) {
      localStorage.setItem("reminder", JSON.stringify([]));
      setReminder(JSON.parse(localStorage.getItem("reminder")));
    } else if (!JSON.parse(local_reminder).length == 0) {
      var temp = JSON.parse(local_reminder);
      setReminder(temp);
      
    }
  }, []);

  const handleSubmit = (e) => {
    console.log(recurrent)
    e.preventDefault();
    setLoading(true);
    setMessage("Loading....");
    setRole("primary");
    const userId = cookie.get("userId");
    fetch("https://mail-reminder-app.herokuapp.com/remind", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "authorization":  `Bearer ${cookie.get('access')}`
      },
      body: JSON.stringify({ body, subject, date, userId , recurrent}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error.message);
          setRole("danger");
          setLoading(true);
          setTimeout(() => {
            setLoading(false)
          }, 2000);
          setSubject("");
          setBody("");
          setDate("");
        } else {
          setMessage(data.message);
          setRole("success");
          setLoading(true);
          setTimeout(() => {
            setLoading(false)
          }, 2000);

          var temp = JSON.parse(localStorage.getItem("reminder"));
          temp.push({ subject, body, date });
          localStorage.setItem("reminder", JSON.stringify(temp));
          setReminder(JSON.parse(localStorage.getItem("reminder")));

          setSubject("");
          setBody("");
          setDate("");
          
        }
      });
  };

  const deleteReminder = (index,subject) => {
 
    fetch("https://mail-reminder-app.herokuapp.com/cancel_remind", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "authorization":  `Bearer ${cookie.get('access')}`
      },
      body: JSON.stringify({ subject }),
    }).then(res=>res.json()).then((data,err)=>{
      if(data.error){
        setMessage(data.error.message);
        setRole("danger");
        setLoading(true);
        setTimeout(() => {
          setLoading(false)
        }, 2000);
        
      }
      else{
        setMessage(data.message);
        setRole("success");
        setLoading(true);
        setTimeout(() => {
          setLoading(false)
        }, 2000);
        var temp = JSON.parse(localStorage.getItem("reminder"));
        temp.splice(index, 1);
        localStorage.setItem("reminder", JSON.stringify(temp));
        setReminder(JSON.parse(localStorage.getItem("reminder")));
       
      }
    })
  };

  const updateReminder = (index) => {
    var temp = JSON.parse(localStorage.getItem("reminder"));
    const temp2 = temp.find((card, i) => {
      if (i === index) {
        return card;
      }
    });

    setSubject(temp2.subject);
    setBody(temp2.body);
    setDate(temp2.date);
  };
  const reminderCards = (e) => {
    return reminder.map((card, i) => {
      return (
        <div key={i} className="card mb-3">
          <h5 className="card-header">{card.subject}</h5>
          <div className="card-body">
            <h5 className="card-title">{card.body}</h5>
            <p className="card-text">{card.date}</p>
            <button
              onClick={() => deleteReminder(i,card.subject)}
              className="btn btn-primary"
            >
              Delete
            </button>
            <button
              onClick={() => updateReminder(i)}
              className="btn btn-primary"
            >
              Update
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <React.Fragment>
      <div style={{ marginTop: "5rem" }}>
        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Subject
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleFormControlInput1"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
            }}
            placeholder="Subject"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleFormControlTextarea1" className="form-label">
            Body
          </label>
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
            }}
          ></textarea>
        </div>

        <input
          type="datetime-local"
          id="Appointment Date"
          name="time"
          mydate="Appointment_Date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
          }}
          required
        />
        <br />
        <div class="form-check">
        <input class="form-check-input" type="radio" name="radio" id="onlyonce" value='Only Once' checked onChange={(e)=>setRecurrent(e.target.value)}/>
        <label class="form-check-label" for="onlyonce">
          Only Once
        </label>
      </div>
        <div class="form-check">
        <input class="form-check-input" type="radio" name="radio" id="daily" value='Daily' onChange={(e)=>setRecurrent(e.target.value)}/>
        <label class="form-check-label" for="daily">
          Daily
        </label>
      </div>
      <div class="form-check">
      <input class="form-check-input" type="radio" name="radio" id="weekly" value='Weekly' onChange={(e)=>setRecurrent(e.target.value)}/>
      <label class="form-check-label" for="weekly">
        Weekly
      </label>
    </div>
    <div class="form-check">
    <input class="form-check-input" type="radio" name="radio" id="monthly"  value='Monthly' onChange={(e)=>setRecurrent(e.target.value)}/>
    <label class="form-check-label" for="monthly">
      Monthly
    </label>
  </div>
     
        <br></br>
        <br></br>
        {loading && (
          <div className={`alert alert-${role}`} role="alert">
            {message}
          </div>
        )}

        <button
          type="submit"
          onClick={handleSubmit}
          className="submit btn btn-light"
          name="button"
        >
          Add Reminder
        </button>
      </div>
      <br></br>

      <div></div>
      {reminder.length != 0 && reminderCards()}
    </React.Fragment>
  );
}
