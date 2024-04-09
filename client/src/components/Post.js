import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Post({ id, title, summary, image, createdAt, author }) {
  return (
    <Link to={`/post/${id}`}>
      <header className='post-header'>
        <time>{format(new Date(createdAt), 'MMM dd, yyyy')}</time>
        <p className='post-author'>{author}</p>
      </header>
      <div className='post'>
        <div className='post-img'>
          <img src={image} alt='Blog banner' />
        </div>
        <div className='post-info'>
          <h2 className='post-title'>{title}</h2>
          <p className='post-summary'>{summary}</p>
        </div>
      </div>
    </Link>
  );
}
