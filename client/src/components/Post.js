import { formatISO9075 } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Post({
  _id,
  title,
  summary,
  image,
  createdAt,
  author,
}) {
  return (
    <div className='post'>
      <div className='post-img'>
        <Link to={`/post/${_id}`}>
          <img src={image} alt='Blog banner' />
        </Link>
      </div>
      <div className='post-info'>
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className='post-info'>
          <a className='post-author' href=''>
            {author}
          </a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className='post-summary'>{summary}</p>
      </div>
    </div>
  );
}
