import Card from 'react-bootstrap/Card';

export default function MissingCard(props) {
    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title><h4>{props.title}</h4></Card.Title>
                    <Card.Text>
                        <p>{props.body}</p>
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    );
}