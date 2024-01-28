import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PT from 'prop-types'
import axios from 'axios'
import axiosWithAuth from '../axios'
export default function Articles(props) {
  // ✨ where are my props? Destructure them here
  // ✨ implement conditional logic: if no token exists
  // we should render a Navigate to login screen (React Router v.6)
  const navigate = useNavigate();
  if (!localStorage.getItem('token')) {
   navigate('/')
  }
  useEffect(() => {
    // ✨ grab the articles here, on first render only
    axios.get('http://localhost:9000/api/articles', {
      headers: {
        'Authorization': `${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }
    )
      .then((res) => {
        props.setArticles(res.data.articles);
        props.setMessage(res.data.message)

      }).catch((err) => {
        console.error(err)
      })
  }, [])
  const editArticle = (articleID) => {
    props.setCurrentArticleId(articleID)
  }

  return (
    // ✨ fix the JSX: replace `Function.prototype` with actual functions
    // and use the articles prop to generate articles
    <div className="articles">
      <h2>Articles</h2>
      {
        !props.articles.length
          ? 'No articles yet'
          : props.articles.map(art => {
            return (
              <div className="article" key={art.article_id}>
                <div>
                  <h3>{art.title}</h3>
                  <p>{art.text}</p>
                  <p>Topic: {art.topic}</p>
                </div>
                <div>
                  <button
                    disabled={false}
                    onClick={() => editArticle(art.article_id)}
                  >Edit</button>
                  <button
                    disabled={false}
                    onClick={() => props.deleteArticle(art.article_id)}
                  >Delete</button>
                </div>
              </div>
            )
          })
      }
    </div>
  )
}

