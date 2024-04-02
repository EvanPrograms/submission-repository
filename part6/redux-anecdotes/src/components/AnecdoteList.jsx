import { useDispatch, useSelector } from "react-redux"
import { voteAdder } from "../reducers/anecdoteReducer"

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state)

  const vote = (id) => {
    console.log('vote', id)
    dispatch(voteAdder(id))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes
        .sort((b, a) => a.votes - b.votes)
        .map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList