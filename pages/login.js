import { useAtom } from 'jotai';
import { useState } from 'react';
import { Card } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';
import { favouritesAtom } from '@/store';
import { searchHistoryAtom } from '@/store';
import { getHistory } from '@/lib/userData';
import { getFavourites } from '@/lib/userData';
import { authenticateUser } from '@/lib/authenticate';

export default function Login() {
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [warning, setWarning] = useState('');
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await authenticateUser(user, password);
            await updateAtoms();
            router.push('/favourites');
            
        } catch (err) {
            console.log(err);
            setWarning(err.message);
        }
    }

    async function updateAtoms() {
        setFavouritesList(await getFavourites()); 
        setSearchHistory(await getHistory()); 
    }    

    return (
        <>
            <Card bg='light'>
                <Card.Body><h2>Login</h2>Enter your login information below:</Card.Body>
            </Card>
            <br />
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>User:</Form.Label><Form.Control type='text' value={user} id='userName' name='userName' onChange={e => setUser(e.target.value)} />
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Label>Password:</Form.Label><Form.Control type='password' value={password} id='password' name='password' onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <br />
                <Button variant='primary' className='pull-right' type='submit'>Login</Button>
            </Form>
            { warning && ( <><br /><Alert variant='danger'>{warning}</Alert></> )}
        </>
    );
}