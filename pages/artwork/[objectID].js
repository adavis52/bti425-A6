import ArtworkCardDetail from '@/components/ArtworkCardDetail';
import { useRouter } from 'next/router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function ArtworkById() {
    const router = useRouter();
    const { objectID } = router.query;

    return (
        <Row>
            <Col>
                <ArtworkCardDetail objectID={objectID} />
            </Col>
        </Row>
    );
}