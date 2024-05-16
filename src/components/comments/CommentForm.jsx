import React, { useState } from 'react';
import axios from 'axios';
import './comments.css';

const CommentForm = ({ postId, userId }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/comments', { postId, userId, content });
      setContent(''); 
    } catch (error) {
      console.error('Error al enviar el comentario:', error);
    }
  };

 return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        className="comment-input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe tu comentario..."
      />
      <button className="comment-button" type="submit">Guardar Comentario</button>
    </form>
  );
};

export default CommentForm;
