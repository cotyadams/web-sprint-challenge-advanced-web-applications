import React, { useEffect, useState } from 'react'
import PT from 'prop-types'
import axios from 'axios'
const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues)
  // ✨ where are my props? Destructure them here
  let selectedArticle 
  useEffect(() => {
    // ✨ implement
    // Every time the `currentArticle` prop changes, we should check it for truthiness:
    // if it's truthy, we should set its title, text and topic into the corresponding
    // values of the form. If it's not, we should reset the form back to initial values.
    if (props.currentArticle) {
      selectedArticle = props.articles.filter((article) => (article.article_id == props.currentArticle))
      setValues({...selectedArticle[0]})
    } else {
      setValues(initialFormValues)
    }
  }, [props.currentArticle])

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  async function onSubmit (evt) {
    evt.preventDefault()
    // ✨ implement
    // We must submit a new post or update an existing one,
    // depending on the truthyness of the `currentArticle` prop.
    if (!props.currentArticle) {
      await props.postArticle(values).finally(() => {
      setValues(initialFormValues)
    })
    } else {
      props.setSpinnerOn(true)
      axios.put(`http://localhost:9000/api/articles/${props.currentArticle}`, values, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then((res) => {
        props.setMessage(res.data.message);
        props.setArticles([...props.articles.filter((art) => {
          return art.article_id !== props.currentArticle
        }), values])
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        setValues(initialFormValues)
        props. setSpinnerOn(false)
      })
    }
  }
  const cancelForm = () => {
    setValues({ initialFormValues });
    props.setCurrentArticleId(null);
  }

  const isDisabled = () => {
    // ✨ implement
    // Make sure the inputs have some values
    if (values.text && values.title && values.topic) {
      return false
    } else {
      return true
    }
  }

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>Create Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        {props.currentArticle ? <button onClick={cancelForm}>Cancel edit</button> : <></>}
      </div>
    </form>
  )
}


