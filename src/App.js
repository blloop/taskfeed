import { useState, useEffect } from 'react';
import './App.css';
import Today from './components/Today';
import All from './components/All';
import Feed from './components/Feed';
import SECRETS from './env';

const App = () => {
  const [taskList, setTasks] = useState([]);
  const [feedList, setFeed] = useState([]);
  const [pageIndex, setIndex] = useState(0);

  // get task data from Google Sheets
  const fetchTasks = () => {
    try {
      let url = `https://sheets.googleapis.com/v4/spreadsheets/${SECRETS.SHEET_ID}`;
      url += `/values/${SECRETS.USER_SHEET}?alt=json&key=${SECRETS.API_KEY}`;
      fetch(url)
        .then(res => res.text())
        .then(rep => {
          if (JSON.parse(rep)['values'] !== undefined) {
            const tempList = [];
            const taskData = JSON.parse(rep)['values'];
            for (let i = 1; i < taskData.length; i++) {
              tempList.push({
                name: taskData[i][0],
                desc: taskData[i][1],
                priority: taskData[i][2],
                duration: taskData[i][3],
                deadline: taskData[i][4]
              })
            }
            setTasks(tempList);
          }
        });
    } catch (err) {
      console.log(err);
    }
  }
  const fetchFeed = () => {
    try {
      let url = `https://sheets.googleapis.com/v4/spreadsheets/${SECRETS.SHEET_ID}`;
      url += `/values/${SECRETS.FEED_SHEET}?alt=json&key=${SECRETS.API_KEY}`;
      fetch(url)
        .then(res => res.text())
        .then(rep => {
          if (JSON.parse(rep)['values'] !== undefined) {
            const tempList = [];
            const taskData = JSON.parse(rep)['values'];
            for (let i = 1; i < taskData.length; i++) {
              tempList.push({
                name: taskData[i][0],
                desc: taskData[i][1],
                priority: taskData[i][2],
                duration: taskData[i][3],
                deadline: taskData[i][4]
              })
            }
            setFeed(tempList);
          }
        });
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    fetchTasks();
    fetchFeed();
  }, []);

  // add task to task list
  const addTask = (task) => {
    let tempList = taskList;
    tempList.push(task);
    setTasks(tempList);
  }

  switch (pageIndex) {
    case 0: 
      return (
        <Today
          pageIndex={pageIndex}
          setIndex={setIndex}
          addTask={addTask}
          taskList={taskList}
        />
      );
    case 1: 
      return (
        <All
          pageIndex={pageIndex}
          setIndex={setIndex}
          addTask={addTask}  
        />
      );
    default: // case 2
      return (
        <Feed
          pageIndex={pageIndex}
          setIndex={setIndex}
          addTask={addTask}  
        />
      );
  }
}

export default App;
