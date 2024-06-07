import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom'
import { gql, useQuery, useApolloClient } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";



const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [page, setPage] = useState("authors");
  const result = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)
  const client = useApolloClient()

  console.log('this is result', result.data)
  console.log('this is booksResult', booksResult.data)

  if (result.loading) {
    return <div>Loading...</div>
  }

  if (booksResult.loading) {
    return <div>Loading...</div>
  }
  
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const padding = {padding: 5}

  return (
    <Router>
      <div>
        {/* <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button> */}
        <Link style={padding} to="/" onClick={() => setPage("authors")}>authors</Link>
        <Link style={padding} to="/books" onClick={() => setPage("books")}>books</Link>
        { token ? (
          <>
            <Link style={padding} to="/add" onClick={() => setPage("add")}>add book!</Link>
            <Link style={padding} to="/" onClick={logout}>logout</Link>
          </>
        ) : (
          <Link style={padding} to="/login" onClick={() => setPage("login")}>login</Link>
        )}
        {/* <Link style={padding} to="/add" onClick={() => setPage("add")}>add book!</Link>
        <Link style={padding} to="/login" onClick={() => setPage("login")}>login</Link> */}
      </div>
        
      <Routes>
        <Route path="/" element={<Authors data={result.data.allAuthors} show={page === "authors"}/>} />
        <Route path="/books" element={<Books data={booksResult.data.allBooks} show={page === "books"}/>} />
        <Route path="/add" element={<NewBook show={page === "add"}/>} />
        <Route path="/login" element={<LoginForm setToken={setToken}/>} />
      </Routes>
  
      {/* <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} /> */}
    </Router>
  );
};

export default App;

// {user
//   ?
//   <span>
//     <em style={padding}>{user.username} logged in</em>
//     <button onClick={logOut}>logout</button>
//   </span>
//   : <Link style={padding} to="/">login</Link>
// }