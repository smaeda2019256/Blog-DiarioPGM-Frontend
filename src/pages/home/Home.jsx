import React, { useEffect, useState } from "react"
import { Card } from "../../components/blog/Card"
import './home.css';
import { Category } from "../../components/tecno/Category.jsx"
import axios from "axios"
import { useLocation } from "react-router-dom"

export const Home = () => {
  const [posts, setPosts] = useState([])

  const { search } = useLocation()


  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get("/posts" + search)
      setPosts(res.data)
    }
    fetchPost()
  }, [search])
  return (
    <>
    <h1 className="h1">Technologies </h1>
    <Category />
      <h1 className="h1">Recent Posts</h1>
      <Card posts={posts} />
    </>
  )
}
