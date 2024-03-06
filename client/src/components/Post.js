import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Post({ id, title, summary, image, createdAt, author }) {
  return (
    <div className='post'>
      <div className='post-img'>
        <Link to={`/post/${id}`}>
          <img src={image} alt='Blog banner' />
        </Link>
      </div>
      <div className='post-info'>
        <Link to={`/post/${id}`}>
          <h2>{title}</h2>
        </Link>
        <p className='post-info'>
          <a className='post-author' href=''>
            {author}
          </a>
          <time>{format(new Date(createdAt), 'MMM dd, yyyy HH:mm')}</time>
        </p>
        <p className='post-summary'>{summary}</p>
      </div>
    </div>
  );
}
