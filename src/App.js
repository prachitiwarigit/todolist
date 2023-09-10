import './App.css';
import { useState, useEffect } from 'react'

function App() {

  const [task, setTask] = useState([]);
  const [parentId, setParentId] = useState(''); 
  const [labelText, setLabelText] = useState('Enter Task'); 


  let newData = [];

  const [inputValue, setinputValue] = useState('');

  useEffect(()=>{
      getData();
  }, []);

  function getData(){
    const data = localStorage.getItem('task');

    if(data){
      setTask(JSON.parse(data))
    }
  }

  const handleInput = (e) => {
    setinputValue(e.target.value);
  }

  const handleClick = () => {
    parentId ? setChildTask(inputValue) : setTaskInput(inputValue);
  }

  function setChildTask(inputValue){
    const taskOld = JSON.parse(localStorage.getItem('task'));
    let index = taskOld.findIndex(x => x.id === parentId );
    let child = taskOld[index].child;
    child.push({id: parseInt(child.length)+1, task: inputValue });
    taskOld[index].child = child;
    localStorage.setItem('task', JSON.stringify(taskOld));
    getData();
  }

  function setTaskInput(input){
    let length = 1;
    const taskOld = localStorage.getItem('task');
    if(taskOld && JSON.parse(taskOld).length){
      newData = JSON.parse(taskOld);
      length = newData[newData.length-1];
      length = parseInt(length?.id)+1;
    }
    newData.push({
      id: length,
      taskName: input,
      taskStatus: 0,
      child: []
    });
    localStorage.setItem('task', JSON.stringify(newData));
    getData();
  }

  function Delete(id){
    const taskOld = JSON.parse(localStorage.getItem('task'));
    let index = taskOld.findIndex(x => x.id === id );
    taskOld.splice(index, 1);  
    localStorage.setItem('task', JSON.stringify(taskOld));
    getData();     
  }

  function markRead(id){
    const taskOld = JSON.parse(localStorage.getItem('task'));
    let index = taskOld.findIndex(x => x.id === id );
    let status =  taskOld[index].taskStatus;
    taskOld[index].taskStatus = status ? 0 : 1;
    localStorage.setItem('task', JSON.stringify(taskOld));
    getData(); 
  }

  return (
    <div className="App container mt-5">
      <h1>Create ToDo</h1>
      <hr />
      <div className='row d-flex align-items-center justify-content-center'>
        <div className='col-sm-6'>
          <label>{parentId ? 'Enter Sub Task' : labelText }</label>
          <input type="text" className='form-control' placeholder={parentId ? 'Enter Sub Task' : 'Enter Task'} onChange={handleInput} />
          <button className='btn btn-success w-100 mt-3' onClick={() => {
            handleClick()
          }}>{parentId ? 'Add Sub Task' : 'Add Task'}</button>
        </div>

        <div className='row d-flex align-items-center justify-content-center'>
          <div className='mt-3 col-sm-6'>
            <table className="table">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Message</th>
                  <th scope="col">Delete</th>
                  <th scope="col">Read/Unread</th>
                  <th scope="col">Add Subtask</th>
                </tr>
              </thead>
              <tbody>

                {task.map((item, key) => {
                  let checked = item?.taskStatus ? {checked: true} : '';
                  return (
                    <>
                    <tr key={key}>
                      <th scope="row" key={key}>{key+1}</th>
                      <td>{item.taskName}</td>
                      <td>
                        <button className='btn btn-danger btn-sm' onClick={()=>Delete(item?.id)}>Del</button>
                      </td>
                      <td>
                        <input type="checkbox" {...checked} onClick={()=> markRead(item?.id)}/>
                      </td>
                      <td>
                        <button className='btn btn-primary btn-sm' onClick={()=> setParentId(item?.id)}>Subtask</button>
                      </td>
                    </tr>
                    {
                      (item?.child.length > 0) &&
                      <tr>
                      <td colSpan='5'>
                      <table className="table">
                        <thead className="thead-dark">
                          <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Sub Task</th>
                          </tr>
                        </thead>
                        <tbody>
                            {
                              item?.child.map((itemChild, index) => {
                                return (
                                  <tr key={`${index}helo`}>
                                    <th scope="row" key={key}>{index+1}</th>
                                    <td>{itemChild.task}</td>
                                  </tr>
                                )
                              })
                            }
                        </tbody>
                        </table>
                        </td>
                        </tr>
                    }
                    </>
                    


                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
