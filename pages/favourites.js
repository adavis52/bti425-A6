import ArtworkCard from '@/components/ArtworkCard';
import MissingCard from '@/components/MissingCard';
import { favouritesAtom } from '@/store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useAtom } from 'jotai';

export default function Favourites() {
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

    if(!favouritesList) return null;

    if (favouritesList.length === 0) {
        return (
            <>
                <br/>
                <br/>
                <MissingCard title="Nothing Here" body="Try adding some new artwork to the list"></MissingCard>
            </>
        );
    }

    return (
        <>
            <Row className="gy-4">
                {favouritesList.map((currentObjectID) => (
                    <Col lg={3} key={currentObjectID}>
                        <ArtworkCard objectID={currentObjectID}></ArtworkCard>
                    </Col>
                ))}
            </Row>
        </>
    );
}