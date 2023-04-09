import validObjectIDList from '@/public/data/validObjectIDList.json';
import MissingCard from '@/components/MissingCard';
import ArtworkCard from '@/components/ArtworkCard';
import Pagination from 'react-bootstrap/Pagination';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Error from 'next/error';
import useSWR from 'swr';

const PER_PAGE = 12;
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Artwork() {
    const router = useRouter();
    let finalQuery = router.asPath.split('?')[1];
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`, fetcher);

    const [artworkList, setArtworkList] = useState([]);
    const [page, setPage] = useState(0);

    function previousPage() {
        if (page > 1) setPage(prev => prev - 1);
    }

    function nextPage() {
        if (page < artworkList.length) setPage(next => next + 1);
    }

    useEffect(() => {
        if (data !== null || data !== undefined) {
            let filteredResults = validObjectIDList.objectIDs.filter(x => data?.objectIDs?.includes(x));

            const results = [];
            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
                const chunk = filteredResults.slice(i, i + PER_PAGE);
                results.push(chunk);
            }

            setArtworkList(results);
            setPage(1)
        }
    }, [data]);

    if (data === null || data === undefined) {
        return <Error statusCode={404} />;
    }
    else if (artworkList !== null && artworkList !== undefined) {
        if (artworkList.length === 0) {
            return (
                <MissingCard title="Nothing Here" body="Change your search query"></MissingCard>
            );
        }
        return (
            <>
                <Row className="gy-4">
                    {artworkList.length > 0 && artworkList[page - 1].map((currentObjectID) => (
                        <Col lg={3} key={currentObjectID}>
                            <ArtworkCard objectID={currentObjectID} />
                        </Col>
                    ))}
                </Row>
                <Row className="gy-4">
                    {artworkList.length > 0 &&
                        <Col lg={3}>
                            <Pagination>
                                <Pagination.Prev onClick={previousPage} />
                                <Pagination.Item>{page}</Pagination.Item>
                                <Pagination.Next onClick={nextPage} />
                            </Pagination>
                        </Col>
                    }
                </Row>
            </>
        );
    }
    else if (artworkList === null && artworkList === undefined) {
        return null;
    }
}