import React, { useContext, useEffect, useState } from "react";
import "./details.css";
import "../../components/header/header.css";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { Context } from "../../context/Context";
import CommentForm from "../../components/comments/CommentForm.jsx";
import CommentList from "../../components/comments/CommentList.jsx";

export const DetailsPages = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const history = useHistory(); // Para redireccionar al login

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [update, setUpdate] = useState(false);
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const { user } = useContext(Context);

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get("/posts/" + path);
        setPost(res.data);
        setTitle(res.data.title);
        setDesc(res.data.desc);
        setGithubLink(res.data.githubLink);
      } catch (error) {
        console.error("Error al obtener la publicación:", error);
      }
    };
    getPost();
  }, [path]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${post._id}`, { data: { username: user?.username } });
      history.push("/");
    } catch (error) {
      console.error("Error al eliminar la publicación:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/posts/${post._id}`, { username: user?.username, title, desc, githubLink });
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar la publicación:", error);
    }
  };

  const handleCommentSubmit = async (content) => {
    if (!user) {
      history.push("/login");
    } else {
      try {
        const response = await axios.post('/comments', { postId: post._id, userId: user._id, content });
        setComments([...comments, response.data]);
      } catch (error) {
        console.error("Error al enviar el comentario:", error);
      }
    }
  };

  return (
    <>
      <section className="singlePage">
        <div className="container">
          <div className="left">{post.photo && <img src={`http://localhost:5000/images/${post.photo}`} alt="" />}</div>
          <div className="right">
            {post.username === user?.username && (
              <div className="buttons">
                <button className="button" onClick={() => setUpdate(true)}>
                  <BsPencilSquare />
                </button>
                <button className="button" onClick={handleDelete}>
                  <AiOutlineDelete />
                </button>
                {update && (
                  <button className="button" onClick={handleUpdate}>
                    Update
                  </button>
                )}
              </div>
            )}

            {update ? <input type="text" value={title} className="updateInput" placeholder="New Title" onChange={(e) => setTitle(e.target.value)} /> : <h1>{post.title}</h1>}
            {update ? <textarea value={desc} cols="30" rows="10" className="updateInput" placeholder="New Description" onChange={(e) => setDesc(e.target.value)}></textarea> : <p>{post.desc}</p>}
            {update ? <input type="text" value={githubLink} className="updateInput" placeholder="New Link of Github" onChange={(e) => setGithubLink(e.target.value)} /> : <h1></h1>}

            <p>
              Author: <Link to={`/?user=${post.username}`}>{post.username}</Link>
            </p>

            {post.githubLink && (
              <p>
                GitHub: <a href={post.githubLink} target="_blank" rel="noopener noreferrer">{post.githubLink}</a>
              </p>
            )}

            <CommentForm postId={post._id} userId={user?._id} updateComments={setComments} onCommentSubmit={handleCommentSubmit} /> 
            <CommentList comments={comments} postId={post._id} userId={user?._id} />
            {!user && (
              <p>
                Para poder comentar, <Link to="/login">Inicia Sesión</Link>.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
