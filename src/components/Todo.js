import React, {useState, useEffect, useReducer, useRef, useMemo} from 'react';
import axios from 'axios'
import List from './List'
import { useFormInput } from '../hooks/forms'

const todo = props => {
  const [inputIsValid, setInputIsValid] = useState(false)
  // const [todoName, setTodoName] = useState('');
  // const [submittedTodo, setSubmittedTodo] = useState(null)
  // const [todoList, setTodoList] = useState([]);
  const todoInputRef = useRef()

  const todoInput = useFormInput()

  // useReducer
  /* Action is an info of what we want to do, state is the current state of the component  */
  const todoListReducer = (state, action) => {
    switch (action.type) {
      case 'ADD':
        return state.concat(action.payload)
        
      case 'SET':
        return action.payload

      case 'REMOVE':
        return state.filter((todo) => todo.id !== action.payload.id)
      default:
        return state
    }
  }

  const [todoList, dispatch] = useReducer(todoListReducer, [])

  useEffect(()=> {
    axios.get('https://react-hooks-81187.firebaseio.com/todo.json')
      .then(res => {
        console.log(res)
        const todoData = res.data 
        const todos = []
        for(let key in todoData){
          todos.push({id: key, name: todoData[key].name})
        }
        dispatch({type: 'SET', payload: todos })
      })
      .catch(err => {
        console.log(err)
      })

    return () => (
      console.log('cleaning up ...')
    )
  }, [])

  const mouseMoveHandler = e => {
    // console.log(e.clientX, e.clientY)
  }

  useEffect(() => {
    document.addEventListener('mousemove', mouseMoveHandler )
    return ()=> {
      document.removeEventListener('mousemove', mouseMoveHandler)
    }
  })

  // submit todo
  // useEffect(() => {
  //   if(submittedTodo) {
  //     dispatch({
  //       type: 'ADD', 
  //       payload: submittedTodo
  //     })
  //   }
  // }, [submittedTodo])

  // const inputChangeHandler = event => {
  //   setTodoName(event.target.value);
  // };

  const todoAddHandler = () => {
    const todoName = todoInput.value
   
    axios.post('https://react-hooks-81187.firebaseio.com/todo.json', {name :todoName})
    .then(res => {
      
        const todoItem = {id: res.data.name, name: todoName}
        dispatch({type: 'ADD', payload: todoItem})
      
    })
    .catch(err => {
      console.log(err)
    })
  };

  const todoRemoveHandler = todoId => {
    axios.delete(`https://react-hooks-81187.firebaseio.com/todo/${todoId}.json`)
    .then(res => {
      dispatch({ type: 'REMOVE', payload: { id: todoId} })
    })
    .catch(err => console.log(err))
  }

  const inputValidationHandler = e => {
    if(e.target.value.trim() === '') {
      setInputIsValid(false)
    } else {
      setInputIsValid(true)
    }
  }

  return (
    <React.Fragment>
      <input
        type="text"
        placeholder="Todo"
        onChange = {todoInput.onChange}
        value = {todoInput.value}
        style={{
          backgroundColor: todoInput.validity ?  'transparent' : 'red'
        }}
      />

      <button type="button" onClick={todoAddHandler}>
        Add
      </button>
      {useMemo(
        () => (
          <List items = {todoList} onClick={todoRemoveHandler}/>
        ) , 
        [todoList])}
      {/* when one of the todolist in the array changes the list will rerender */}
    </React.Fragment>
  );
};

export default todo;






/*
  - use memo is used in place of should component update 
  - when destucturing array in useState the first value is the old state while he second is the fucntion that updates the first

  - if you want something to run before the function loads use useEffect not to put the method directly in the function

  - dont make a request directly in useEffect function

  - useEffect takes two argument and will update if the second value changes

  - you can cleanup after the last useEffect by using return

*/
