import React, { useContext, useState } from 'react'
import { useParams } from 'react-router'
import { AppContext } from '../context/AppContext'

export default function TripDetail() {
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [showingExpenseInput, setShowingExpenseInput] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const {countryName} = useParams();
  const {state , dispatch} = useContext(AppContext);
  const currentUser = state.users[state.currentUserId];
  const [showingInput , setShowingInput] = useState(false);
  const [showingInputA , setShowingInputA] = useState(false);
  const [inputC , setInputC] = useState("");
  const [inputA , setInputA] = useState("");
  const trip = currentUser?.trips?.[countryName];
  const spent = trip.expenses.reduce(
  (sum, expense) => sum + expense.amount,
  0
);
  const addCompanion = ()=>{
    if (inputC.trim() === "") {
      return
    }
    else{
      dispatch({type:'ADD_COMPANION',payload:{countryName,companionName:inputC}});
      setShowingInput(false);
    };
    setInputC("");
  }
    const addActivity = ()=>{
    if (inputA.trim() === "") {
      return
    }
    else{
      dispatch({type:'ADD_ACTIVITY',payload:{countryName,activityName:inputA}});
      setShowingInputA(false);
    };
    setInputA("");
  }
  function addExpense() {
  const title = expenseTitle.trim();
  const amount = Number(expenseAmount);

  if (!title || !Number.isFinite(amount) || amount <= 0) return;

  dispatch({
    type: "ADD_EXPENSE",
    payload: { countryName, title, amount },
  });

  setExpenseTitle("");
  setExpenseAmount("");
  setShowingExpenseInput(false);
}
function saveBudget() {
  if (budgetInput.trim() === "") return;

  const budget = Number(budgetInput);
  if (!Number.isFinite(budget) || budget < 0) return;

  dispatch({
    type: "SET_TRIP_BUDGET",
    payload: { countryName, budget },
  });

  setEditingBudget(false);
}
  return (
    <div className='pb-15'>
    <div className='w-full h-13 flex justify-center items-center bg-primary-content mt-5 '>
    <p className='font-header text-2xl'>{countryName}</p>
    </div>
    <div className='grid grid-cols-1 sm:grid-cols-3 items-center'>
     <div className="w-[80%] min-h-20 bg-base-200 mx-auto rounded-3xl mt-5 flex flex-col px-5 py-3 md:w-60 ">
  <p className="text-primary font-pop text-xl">Budget:</p>

  <div className="flex items-center justify-between gap-2">
    <p className="text-primary font-pop text-2xl">{trip.budget}</p>

    <button
      type="button"
      className="btn btn-primary btn-sm"
      onClick={() => {
        setBudgetInput(String(trip.budget));
        setEditingBudget(true);
      }}
    >
      Edit
    </button>
  </div>

  {editingBudget && (
    <div className="flex flex-col gap-2 mt-3">
      <input
        type="number"
        min="0"
        className="w-full px-3 border border-base-content rounded-2xl h-10"
        value={budgetInput}
        onChange={(e) => setBudgetInput(e.target.value)}
      />

      <div className="flex gap-2">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={saveBudget}
        >
          Save
        </button>
        <button
          type="button"
          className="btn btn-sm bg-red-400 text-primary-content"
          onClick={() => setEditingBudget(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  )}
</div>
      <div className='w-[80%] h-20 bg-base-200 mx-auto rounded-3xl mt-5 flex flex-col px-5 py-3 md:flex-1 md:w-60'>
        <p className='text-primary font-pop px-5 text-xl'>Spent: </p>
        <p className='text-primary font-pop px-5 text-2xl'>{spent}</p>
      </div>
      <div className='w-[80%] h-20 bg-base-200 mx-auto rounded-3xl mt-5 flex flex-col px-5 py-3  md:flex-1 md:w-60'>
        <p className='text-primary font-pop px-5 text-xl'>Remainig:</p>
        <p className='text-primary font-pop px-5 text-2xl'>{trip.budget - spent}</p>
      </div>
    </div>
    <div className='bg-base-200 mx-auto rounded-3xl mt-5 w-[80%] h-auto'>
      <div className='flex justify-between px-5 items-center py-1'>
        <p className='text-primary text-xl'>Companions</p>
        <button onClick={()=>setShowingInput(true)} className='btn btn-primary w-10 h-10 text-xl mt-2'>+</button>
      </div>
      <div className='w-[80%] h-px bg-primary mx-auto mt-3'></div>
              {
         !showingInput && trip.companions.length === 0 &&(
            <p className='text-primary mt-5 text-center pb-5'>No Companions added Yet</p>
          )
        }
        {
          trip.companions.map((name , index)=>(
            <React.Fragment key={`${index}-${name}`}>
            <div  className='flex justify-between  px-5 pb-3 mt-5 items-center'>
              <p>{name}</p>
              <button onClick={()=> dispatch({type:"REMOVE_COMPANION",payload:{countryName,index}})} className='btn bg-red-400 text-primary-content max-w-20 w-[30%] h-8'>remove</button>
            </div>
            <div className='w-[80%] h-px bg-primary mx-auto'></div>
            </React.Fragment>
          ))
        }
{
  showingInput && (
        <div className='flex flex-col items-center px-3 gap-5 pb-5 mt-5'>
          <input type="text" placeholder='who you want to go with?' className='w-[90%] px-3 outline-none border border-base-content rounded-2xl h-10 max-w-70' value={inputC} onChange={(e)=>setInputC(e.target.value)} />
        <div className='flex justify-evenly'>
          <button onClick={addCompanion} className='btn btn-primary max-w-20 w-[40%] h-10'>accept</button>
          <button onClick={()=>setShowingInput(false)} className='btn bg-red-400 text-primary-content max-w-20 w-[40%] h-10'>cancel</button>
          </div>
        </div>
  )
}
    </div>
      <div className='bg-base-200 mx-auto rounded-3xl mt-5 w-[80%] h-auto'>
      <div className='flex justify-between px-5 items-center py-1'>
        <p className='text-primary text-xl'>Activities</p>
        <button onClick={()=>setShowingInputA(true)} className='btn btn-primary w-10 h-10 text-xl mt-2'>+</button>
      </div>
      <div className='w-[80%] h-px bg-primary mx-auto mt-3'></div>
       {
         !showingInputA &&  trip.activities.length === 0 &&(
            <p className='text-primary mt-5 text-center pb-5'>No Activities added Yet</p>
          )
        }
                {
          trip.activities.map((name , index)=>(
            <React.Fragment key={`${index}-${name}`}>
            <div  className='flex justify-between  px-5 pb-3 mt-5 items-center'>
              <p>{name}</p>
              <button onClick={()=> dispatch({type:"REMOVE_ACTIVITY",payload:{countryName,index}})} className='btn bg-red-400 text-primary-content max-w-20 w-[30%] h-8'>remove</button>
            </div>
            <div className='w-[80%] h-px bg-primary mx-auto'></div>
            </React.Fragment>
          ))
        }
        {
          showingInputA && (
        <div className='flex flex-col items-center px-3 gap-5 pb-5 mt-5'>
          <input type="text" placeholder='what do you want to do??' value={inputA} onChange={(e)=>setInputA(e.target.value)} className='w-[90%] px-3 outline-none border border-base-content rounded-2xl h-10 max-w-70'/>
        <div className='flex justify-evenly'>
          <button onClick={addActivity} className='btn btn-primary max-w-20 w-[40%] h-10'>accept</button>
          <button onClick={()=>setShowingInputA(false)}  className='btn bg-red-400 text-primary-content max-w-20 w-[40%] h-10'>cancel</button>
          </div>
        </div>
          )
        }

    </div>











        <div className='bg-base-200 mx-auto rounded-3xl mt-5 w-[80%] h-auto'>
      <div className='flex justify-between px-5 items-center py-1 '>
        <p className='text-primary text-xl'>Expenses</p>
        <button onClick={()=>setShowingExpenseInput(true)} className='btn btn-primary w-10 h-10 text-xl mt-2'>+</button>
      </div>
      <div className='w-[80%] h-px bg-primary mx-auto mt-3'></div>
      {showingExpenseInput && (
  <div className="flex flex-col gap-3 p-5 items-center">
    <input
      className="w-[90%] px-3 outline-none border border-base-content rounded-2xl h-10 max-w-70"
      placeholder="What did you pay for?"
      value={expenseTitle}
      onChange={(e) => setExpenseTitle(e.target.value)}
    />

    <input
      className="w-[90%] px-3 outline-none border border-base-content rounded-2xl h-10 max-w-70"
      type="number"
      min="0"
      placeholder="Amount"
      value={expenseAmount}
      onChange={(e) => setExpenseAmount(e.target.value)}
    />

    <div className="flex gap-3">
      <button type="button" className="btn btn-primary max-w-20 w-[40%] h-10" onClick={addExpense}>
        accept
      </button>
      <button
        type="button"
        className="btn bg-red-400 text-primary-content max-w-20 w-[40%] h-10"
        onClick={() => setShowingExpenseInput(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}
{trip.expenses.map((expense) => (
  <React.Fragment key={expense.id}>
    <div className="grid grid-cols-[minmax(0,1fr)_4rem_5rem] items-center gap-2 px-5 py-3">
      <span className="min-w-0 break-words">{expense.title}</span>
      <span className="text-right">{expense.amount}</span>

      <button
        type="button"
        onClick={() =>
          dispatch({
            type: "REMOVE_EXPENSE",
            payload: { countryName, expenseId: expense.id },
          })
        }
        className="btn bg-red-400 text-primary-content w-20 h-8"
      >
        remove
      </button>
    </div>

    <div className="w-[80%] h-px bg-primary mx-auto"></div>
  </React.Fragment>
))}
      {
          trip.expenses.length === 0 &&(
            <p className='text-primary mt-5 text-center pb-5'>No Expenses added Yet</p>
          )
        }
    </div>

    </div>
  )
}
