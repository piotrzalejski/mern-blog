import { Helmet, HelmetProvider } from 'react-helmet-async';

export default function Metadata({ title, description, id = '432432sadf' }) {
  return (
    <HelmetProvider>
      <Helmet key={id}>
        <title>{title}</title>
        <meta name='description' content={description} />
      </Helmet>
    </HelmetProvider>
  );
}
