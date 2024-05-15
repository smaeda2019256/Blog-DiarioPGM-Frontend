import React, { useContext, useEffect, useState } from "react"
import "./details.css"
import "../../components/header/header.css"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { Link } from "react-router-dom"
import { BsPencilSquare } from "react-icons/bs"
import { AiOutlineDelete } from "react-icons/ai"
import { Context } from "../../context/Context"

export const DetailsPages = () => {
  const location = useLocation()
  console.log(location)
  const path = location.pathname.split("/")[2]

  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [githubLink, setGithubLink] = useState("")
  const [update, setUpdate] = useState(false)

  const [post, setPost] = useState({})
  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get("/posts/" + path)
      console.log(res)
      setPost(res.data)
      setTitle(res.data.title)
      setDesc(res.data.desc)
      setGithubLink(res.data.githubLink)
    }
    getPost()
  }, [path])

 
  const PublicFlo = "http://localhost:5000/images/"
  const { user } = useContext(Context)

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${post._id}`, { data: { username: user.username } })
      window.location.replace("/")
    } catch (error) {}
  }

  const handleUpdate = async () => {
    try {
      await axios.put(`/posts/${post._id}`, { username: user.username, title, desc, githubLink })
      window.location.reload()
    } catch (error) {}
  }

  return (
    <>
      <section className='singlePage'>
        <div className='container'>
          <div className='left'>{post.photo && <img src={PublicFlo + post.photo} alt='' />}</div>
          <div className='right'>
            {post.username === user?.username && (
              <div className='buttons'>
                <button className='button' onClick={() => setUpdate(true)}>
                  <BsPencilSquare />
                </button>
                <button className='button' onClick={handleDelete}>
                  <AiOutlineDelete />
                </button>
                {update && (
                  <button className='button' onClick={handleUpdate}>
                    Update
                  </button>
                )}
              </div>
            )}

            {update ? <input type='text' value={title} className='updateInput' placeholder="New Title" onChange={(e) => setTitle(e.target.value)} /> : <h1>{post.title}</h1>}
            {update ? <textarea value={desc} cols='30' rows='10' className='updateInput' placeholder="New Description" onChange={(e) => setDesc(e.target.value)}></textarea> : <p>{post.desc}</p>}
            {update ? <input type='text' value={githubLink} className='updateInput' placeholder="New Link of Github" onChange={(e) => setGithubLink(e.target.value)} /> : <h1></h1>}
            
            <p>
              Author: <Link to={`/?user=${post.username}`}>{post.username}</Link>
            </p>

            {post.githubLink && (
            <p>
              GitHub: <a href={post.githubLink} target="_blank" rel="noopener noreferrer">{post.githubLink}</a>
            </p>
          )}
          </div>
        </div>
      </section>
    </>
  )
}