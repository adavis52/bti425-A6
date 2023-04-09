import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ArtworkCard(props) {
  const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}`, fetcher);

  function display(value) {
    return value ? value : 'N/A';
  }

  if (error) return (<Error statusCode={404} />);
  else if (data === null || data === undefined) return null;

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={data?.primaryImageSmall ? data.primaryImageSmall : 'https://via.placeholder.com/375x375.png?text=[+Not+Available+]'} />
      <Card.Body>
        <Card.Title>{display(data.title)}</Card.Title>
        <Card.Text>
          <b>Date:</b> {display(data.objectDate)}
          <br/>
          <b>Classification:</b> {display(data.classification)}
          <br/>
          <b>Medium:</b> {display(data.medium)}
          <br/>
        </Card.Text>
        <Link passHref href={`/artwork/${props.objectID}`}>
          <Button variant="outline-primary">ID: {props.objectID}</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}