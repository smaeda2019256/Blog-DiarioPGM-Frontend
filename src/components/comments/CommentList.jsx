import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './comments.css';

const CommentList = ({ postId, userId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await axios.get(`/comments/${postId}`);
        // Obtener los detalles del usuario para cada comentario
        const updatedComments = await Promise.all(response.data.map(async (comment) => {
          const userResponse = await axios.get(`/users/${comment.userId}`);
          // Agregar el nombre de usuario al comentario
          return { ...comment, username: userResponse.data.username };
        }));
        setComments(updatedComments);
      } catch (error) {
        console.error('Error al obtener los comentarios:', error);
      }
    };

    loadComments();
  }, [postId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/comments/${id}`, { data: { userId } });
      const updatedComments = comments.filter(comment => comment._id !== id);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
    }
  };

  return (
    <div className="comment-list">
      <h2 className="comment-list-heading">Comentarios</h2>
      {comments.map((comment) => (
        <div key={comment._id} className="comment-item">
          <p className="comment-content">{comment.content}</p>
          {/* Mostrar el nombre de usuario junto con el contenido del comentario */}
          <p className="comment-username">Comentario de: {comment.username}</p>
          {comment.userId === userId && (
            <button className="comment-delete" onClick={() => handleDelete(comment._id)}>Eliminar Comentario</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
