import { createContext, useEffect, useReducer  } from "react";
import type {Dispatch , ReactNode} from "react"


const STORAGE_KEY:string = "travel-app-state";

  type Expense = {
    id: string,
    title:string,
    amount:number,
  };

  type Trip = {
    companions:string[],
    budget:number,
    expenses:Expense[],
    activities:string[],
  }
  type User = {
    likes:string[],
    trips:{
      [countryName:string]:Trip
    }
  }
  type State = {
    currentUserId:null | string,
    users:{
      [user:string]:User
    },
  }
  type ToggleLikeAction = {
    type:"TOGGLE_LIKE",
    payload:string,
  }
  type ToggleTripAction = {
    type:"TOGGLE_TRIP_COUNTRY",
    payload:string,
  }
  type AddCompanion = {
    type:"ADD_COMPANION",
    payload:{
    countryName:string,
    companionName:string,
    }
  }
  type AddActivity = {
    type:"ADD_ACTIVITY",
    payload:{
    countryName:string,
    activityName:string,
    }
  }
  type RemoveActivity = {
    type:"REMOVE_ACTIVITY",
    payload:{
    index:number,
    countryName:string,
    }
  }
  type RemoveCompanion = {
    type:"REMOVE_COMPANION",
    payload:{
    index:number,
    countryName:string,
    }
  }
  type SetTripBudget = {
    type:"SET_TRIP_BUDGET",
    payload:{
    countryName:string,
    budget:number
    }
  }
  type RemoveExpense = {
    type:"REMOVE_EXPENSE"
    payload:{
    countryName:string,
    expenseId:string,
    }
  }
  type Login = {
    type:"LOGIN"
    payload:string
  }
  type AddExpense = {
    type:"ADD_EXPENSE",
    payload:{amount:number,title:string,countryName:string}
  }
  type Logout = {
    type:"LOGOUT"
  }
  type Action = Logout | AddExpense | Login | RemoveExpense | SetTripBudget | RemoveCompanion | RemoveActivity | AddActivity | AddCompanion |  ToggleTripAction | ToggleLikeAction

const initialState:State = {
  currentUserId: null,
  users: {},
};
type Context = {
  state:State,
  dispatch:Dispatch<Action>,
}


function createTrip():Trip {
  return {
    companions: [],
    budget: 0,
    expenses: [],
    activities: [],
  };

}

function appReducer(state:State, action:Action) {
  if (action.type === "TOGGLE_LIKE") {
    const userId:null | string = state.currentUserId;
    if ( userId === null) {
      return state;
    }
    const currentUser = state.users[userId];
    if (!currentUser) return state;

    const countryName:string = action.payload;
    const likes:string[] = currentUser.likes ?? [];
    const updatedLikes = likes.includes(countryName)
      ? likes.filter((name) => name !== countryName)
      : [...likes, countryName];

    return {
      ...state,
      users: {
        ...state.users,
        [userId]: { ...currentUser, likes: updatedLikes },
      },
    };
  }

  if (action.type === "TOGGLE_TRIP_COUNTRY") {
    const userId = state.currentUserId;
    if (userId === null) {
      return state
    }
    const currentUser = state.users[userId];
    if (!currentUser) return state;

    const countryName = action.payload;
    const updatedTrips = { ...(currentUser.trips ?? {}) };

    if (Object.hasOwn(updatedTrips, countryName)) {
      delete updatedTrips[countryName];
    } else {
      updatedTrips[countryName] = createTrip();
    }

    return {
      ...state,
      users: {
        ...state.users,
        [userId]: { ...currentUser, trips: updatedTrips },
      },
    };
  }
  if (action.type === "ADD_COMPANION") {
  const userId = state.currentUserId;
  if (userId === null) {
    return state;
  }
  const currentUser = state.users[userId];
  const { countryName, companionName } = action.payload;

  const trip = currentUser?.trips?.[countryName];
  const name = companionName.trim();

  if (!trip || !name) return state;

  return {
    ...state,
    users: {
      ...state.users,
      [userId]: {
        ...currentUser,
        trips: {
          ...currentUser.trips,
          [countryName]: {
            ...trip,
            companions: [...trip.companions, name],
          },
        },
      },
    },
  };
}
if (action.type === "ADD_ACTIVITY") {
  const userId = state.currentUserId;
  if (userId === null) {
    return state;
  }
  const currentUser = state.users[userId];
  const { countryName, activityName } = action.payload;
  const trip = currentUser?.trips?.[countryName];
  const name = activityName.trim();

  if (!trip || !name) return state;

  return {
    ...state,
    users: {
      ...state.users,
      [userId]: {
        ...currentUser,
        trips: {
          ...currentUser.trips,
          [countryName]: {
            ...trip,
            activities: [...trip.activities, name],
          },
        },
      },
    },
  };
}
if (action.type === "REMOVE_ACTIVITY") {
  const userId = state.currentUserId;
    if (userId === null) {
    return state;
  }
  const currentUser = state.users[userId];
  const { countryName, index } = action.payload;
  const trip = currentUser?.trips?.[countryName];

  if (!trip || index < 0 || index >= trip.activities.length) {
    return state;
  }

  return {
    ...state,
    users: {
      ...state.users,
      [userId]: {
        ...currentUser,
        trips: {
          ...currentUser.trips,
          [countryName]: {
            ...trip,
            activities: trip.activities.filter((_, i) => i !== index),
          },
        },
      },
    },
  };
}
if (action.type === "REMOVE_COMPANION") {
  const userId = state.currentUserId;
    if (userId === null) {
    return state;
  }
  const currentUser = state.users[userId];
  const { countryName, index } = action.payload;
  const trip = currentUser?.trips?.[countryName];

  if (!trip || index < 0 || index >= trip.companions.length) {
    return state;
  }

  return {
    ...state,
    users: {
      ...state.users,
      [userId]: {
        ...currentUser,
        trips: {
          ...currentUser.trips,
          [countryName]: {
            ...trip,
            companions: trip.companions.filter((_, i) => i !== index),
          },
        },
      },
    },
  };
}
if (action.type === "ADD_EXPENSE") {
  const userId = state.currentUserId;
    if (userId === null) {
    return state;
  }
  const currentUser = state.users[userId];
  const { countryName, title, amount } = action.payload;
  const trip = currentUser?.trips?.[countryName];

  if (!trip) return state;

  const expense = {
    id: crypto.randomUUID(),
    title,
    amount,
  };

  return {
    ...state,
    users: {
      ...state.users,
      [userId]: {
        ...currentUser,
        trips: {
          ...currentUser.trips,
          [countryName]: {
            ...trip,
            expenses: [...trip.expenses, expense],
          },
        },
      },
    },
  };
}

if (action.type === "REMOVE_EXPENSE") {
  const userId = state.currentUserId;
    if (userId === null) {
    return state;
  }
  const currentUser = state.users[userId];
  const { countryName, expenseId } = action.payload;
  const trip = currentUser?.trips?.[countryName];

  if (!trip) return state;

  return {
    ...state,
    users: {
      ...state.users,
      [userId]: {
        ...currentUser,
        trips: {
          ...currentUser.trips,
          [countryName]: {
            ...trip,
            expenses: trip.expenses.filter(
              (expense) => expense.id !== expenseId
            ),
          },
        },
      },
    },
  };
}

  if (action.type === "LOGIN") {
    const userId = action.payload.trim().toLowerCase();
    if (!userId) return state;

    const user = state.users[userId] ?? { likes: [], trips: {} };
    return {
      ...state,
      currentUserId: userId,
      users: { ...state.users, [userId]: user },
    };
  }
  if (action.type === "SET_TRIP_BUDGET") {
  const userId = state.currentUserId;
    if (userId === null) {
    return state;
  }
  const currentUser = state.users[userId];
  const { countryName, budget } = action.payload;
  const trip = currentUser?.trips?.[countryName];

  if (!trip || !Number.isFinite(budget) || budget < 0) return state;

  return {
    ...state,
    users: {
      ...state.users,
      [userId]: {
        ...currentUser,
        trips: {
          ...currentUser.trips,
          [countryName]: {
            ...trip,
            budget,
          },
        },
      },
    },
  };
}

  if (action.type === "LOGOUT") {
    return { ...state, currentUserId: null };
  }

  return state;
}

function getInitialState() {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (!savedState) return initialState;

    const parsedState = JSON.parse(savedState);
    const savedUsers = parsedState.users ?? {};

    const users = Object.fromEntries(
      Object.entries(savedUsers).map(([userId, user]) => {
        if (typeof user !== "object" || user === null || Array.isArray(user)) {
         return [userId, { likes: [], trips: {} }];
        }
        const savedUser = user as Record<string, unknown>;
        const { trip: oldTrip, ...userWithoutOldTrip } = savedUser;
        const oldCountries =
        typeof oldTrip === "object" &&
         oldTrip !== null &&
        "countries" in oldTrip &&
         Array.isArray(oldTrip.countries)
          ? oldTrip.countries.filter(
        (countryName): countryName is string =>
          typeof countryName === "string"
          )
        : [];
        const migratedTrips = Object.fromEntries(
          oldCountries.map((countryName) => [countryName, createTrip()])
        );
          const savedTrips =
            typeof savedUser.trips === "object" &&
            savedUser.trips !== null &&
            !Array.isArray(savedUser.trips)
            ? savedUser.trips
            : {};
        return [
          userId,
          {
            ...userWithoutOldTrip,
           likes: Array.isArray(savedUser.likes) ? savedUser.likes : [],
           
            trips: { ...migratedTrips, ...savedTrips },
          },
        ];
      })
    );

    return {
      currentUserId: parsedState.currentUserId ?? null,
      users,
    };
  } catch {
    return initialState;
  }
}

export const AppContext = createContext<Context | null>(null);

export default function AppProvider({ children }:{children:ReactNode}) {
  const [state, dispatch] = useReducer(appReducer, initialState, getInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
