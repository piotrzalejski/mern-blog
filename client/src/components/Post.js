import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Post({ id, title, summary, image, createdAt, author }) {
  return (
    <Link className='post--link' to={`/post/${id}`}>
      <header className='post-header'>
        <time>{format(new Date(createdAt), 'MMM dd, yyyy')}</time>
        <p className='post-author'>{author}</p>
      </header>
      {image && image !== null && (
        <div className='post-img'>
          <img className='post--imgage' src={image} alt='Blog banner' />
        </div>
      )}
      <div className='post-info'>
        <h3 className='post-title'>{title}</h3>
        <p className='post-summary'>{summary}</p>
      </div>
    </Link>
  );
}
