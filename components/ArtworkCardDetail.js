import { removeFromFavourites } from '@/lib/userData';
import { addToFavourites } from '@/lib/userData';
import Button from 'react-bootstrap/Button';
import { favouritesAtom } from '@/store';
import Card from 'react-bootstrap/Card';
import { useEffect } from 'react';
import { useState } from 'react';
import { useAtom } from 'jotai';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ArtworkCardDetail(props) {
  const { data, error } = useSWR(props.objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}` : null, fetcher);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    setShowAdded(favouritesList?.includes(props.objectID))
  }, [favouritesList])


  function display(value) {
    return value ? value : 'N/A';
  }

  async function favouritesClicked() {
    if (showAdded) {
      setFavouritesList(await removeFromFavourites(props.objectID));
      setShowAdded(false);
    }
    else {
      setFavouritesList(await addToFavourites(props.objectID)); 
      setShowAdded(true);
    }
  }

  if (error) return (<Error statusCode={404} />);
  else if (data === null) return null;

  return (
    <Card style={{ width: '18rem' }}>
      {data?.primaryImage && <Card.Img variant="top" src={data.primaryImage} />}
      <Card.Body>
        <Card.Title>{display(data.title)}</Card.Title>
        <Card.Text>
          <b>Date:</b> {display(data.objectDate)}
          <br />
          <b>Classification:</b> {display(data.classification)}
          <br />
          <b>Medium:</b> {display(data.medium)}
          <br></br>
          <br></br>
          <b>Artist:</b> {display(data.artistDisplayName) !== 'N/A' &&
            <>
              {data.artistDisplayName}
              <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer" > wiki</a>
            </>
          }
          <br />
          <b>Credits:</b> {display(data.creditLine)}
          <br />
          <b>Dimensions:</b> {display(data.dimensions)}
        </Card.Text>
        <Button variant={showAdded ? 'primary' : 'outline-primary'} onClick={favouritesClicked}>{showAdded ? '+ Favourite  (added)' : 'Favourite'}</Button>
      </Card.Body>
    </Card>
  );
}