import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import PrivateRoute from './PrivateRoute'
const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'
import axios from 'axios'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */ }
  const redirectToArticles = () => { /* ✨ implement */ }
  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    setSpinnerOn(true);
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token')
    }
    setMessage("Goodbye!")
    navigate('/')
    setSpinnerOn(false)
  }

  async function postArticle (article) {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setSpinnerOn(true)
    const token = localStorage.getItem('token')
    return axios.post('http://localhost:9000/api/articles',
      article,
      {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        setArticles([...articles, res.data.article])
        setMessage(res.data.message)
        console.log(articles)
      }).finally(() => {
        setSpinnerOn(false)
      })
  }

  const deleteArticle = (article_id) => {
    // ✨ implement
    //is making a second axios call the right way to do this?
    setSpinnerOn(true)
    axios.delete(`http://localhost:9000/api/articles/${article_id}`,
      {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((res) => {
        setMessage(res.data.message)
      }).catch((err) => {
        console.error(err)
      }).finally(() => {
        axios.get('http://localhost:9000/api/articles', { headers: { Authorization: localStorage.getItem('token') } })
          .then((res) => {
          setArticles([...res.data.articles])
          }).finally(() => {
          setSpinnerOn(false)
        })
    })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm setMessage={setMessage} setSpinnerOn={setSpinnerOn} />} />
          <Route path="/articles" element={
            <PrivateRoute>
              <ArticleForm
                postArticle={postArticle}
                currentArticle={currentArticleId}
                articles={articles}
                setCurrentArticleId={setCurrentArticleId}
                setArticles={setArticles}
                setMessage={setMessage}
                setSpinnerOn={setSpinnerOn}
              />
              <Articles
                deleteArticle={deleteArticle}
                setCurrentArticleId={setCurrentArticleId}
                setArticles={setArticles}
                setMessage={setMessage}
                articles={articles}
              />
            </PrivateRoute>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
