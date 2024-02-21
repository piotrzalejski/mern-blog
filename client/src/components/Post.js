import { formatISO9075 } from 'date-fns';

export default function Post({ title, summary, image, createdAt, author }) {
  return (
    <div className='post'>
      <div className='post-img'>
        <img src={image} alt='Blog banner' />
      </div>
      <div className='post-info'>
        <h2>{title}</h2>
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
